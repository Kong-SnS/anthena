"use client"

import { useEffect, useState } from "react"
import { Pagination, paginate } from "@/components/admin/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { generateInvoicePDF } from "@/lib/generate-invoice-pdf"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Search, FileText, Send, Download } from "lucide-react"
import { toast } from "sonner"
import type { Invoice } from "@/types"

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<(Invoice & { order: { order_number: string; total: number; customer: { name: string; email: string } | null } | null })[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const PER_PAGE = 20
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("invoices")
        .select("*, order:orders(order_number, total, customer:customers(name, email))")
        .order("issued_at", { ascending: false })
      setInvoices(data || [])
    }
    load()
  }, [])

  const generateInvoice = async (orderId: string, orderNumber: string) => {
    setGenerating(orderId)
    const supabase = createClient()

    // Check if invoice already exists
    const { data: existing } = await supabase
      .from("invoices")
      .select("id")
      .eq("order_id", orderId)
      .single()

    if (existing) {
      toast.error("Invoice already exists for this order")
      setGenerating(null)
      return
    }

    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`

    const { error } = await supabase.from("invoices").insert({
      order_id: orderId,
      invoice_number: invoiceNumber,
      issued_at: new Date().toISOString(),
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Invoice ${invoiceNumber} generated`)
      // Reload
      const { data } = await supabase
        .from("invoices")
        .select("*, order:orders(order_number, total, customer:customers(name, email))")
        .order("issued_at", { ascending: false })
      setInvoices(data || [])
    }
    setGenerating(null)
  }

  const sendInvoice = async (invoiceId: string, email: string, invoiceNumber: string) => {
    try {
      await fetch("/api/email/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoiceId }),
      })
      toast.success(`Invoice sent to ${email}`)

      // Update sent_at
      const supabase = createClient()
      await supabase
        .from("invoices")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", invoiceId)
    } catch {
      toast.error("Failed to send invoice")
    }
  }

  const downloadInvoice = async (inv: typeof invoices[0]) => {
    if (!inv.order) return
    const supabase = createClient()
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_name, quantity, unit_price")
      .eq("order_id", inv.order_id)

    const pdfDataUri = generateInvoicePDF({
      invoiceNumber: inv.invoice_number,
      orderNumber: inv.order.order_number,
      issuedAt: inv.issued_at,
      customerName: inv.order.customer?.name || "Customer",
      customerEmail: inv.order.customer?.email || "",
      items: (orderItems || []).map(i => ({ name: i.product_name, quantity: i.quantity, unitPrice: Number(i.unit_price) })),
      subtotal: Number(inv.order.total) - 8, // approximate
      shippingCost: 8,
      total: Number(inv.order.total),
    })

    const link = document.createElement("a")
    link.href = pdfDataUri
    link.download = `${inv.invoice_number}.pdf`
    link.click()
  }

  const filtered = invoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.order?.order_number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginate(filtered, page, PER_PAGE).map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {inv.invoice_number}
                    </div>
                  </TableCell>
                  <TableCell>#{inv.order?.order_number}</TableCell>
                  <TableCell>{inv.order?.customer?.name || "N/A"}</TableCell>
                  <TableCell>RM {Number(inv.order?.total || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(inv.issued_at).toLocaleDateString("en-MY")}
                  </TableCell>
                  <TableCell>
                    {inv.sent_at ? (
                      <Badge variant="secondary">Sent</Badge>
                    ) : (
                      <Badge variant="outline">Not sent</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadInvoice(inv)}
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {!inv.sent_at && inv.order?.customer?.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => sendInvoice(inv.id, inv.order!.customer!.email, inv.invoice_number)}
                          title="Send to customer"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination page={page} totalItems={filtered.length} perPage={PER_PAGE} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  )
}
