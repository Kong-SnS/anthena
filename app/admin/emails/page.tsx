"use client"

import { useEffect, useState } from "react"
import { Pagination, paginate } from "@/components/admin/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Search, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import type { EmailLog } from "@/types"

const statusColors: Record<string, string> = {
  sent: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  bounced: "bg-orange-100 text-orange-800",
  failed: "bg-red-100 text-red-800",
}

export default function AdminEmailLogsPage() {
  const [emails, setEmails] = useState<EmailLog[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("email_logs")
        .select("*")
        .order("sent_at", { ascending: false })
      setEmails(data || [])
    }
    load()
  }, [])

  const resendEmail = async (emailLog: EmailLog) => {
    try {
      const res = await fetch("/api/admin/emails/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_log_id: emailLog.id }),
      })
      if (!res.ok) throw new Error("Resend failed")
      toast.success(`Email resent to ${emailLog.to_email}`)
    } catch {
      toast.error("Failed to resend email")
    }
  }

  const filtered = emails.filter(
    (e) =>
      e.to_email.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.template.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Email Logs</h1>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, subject..."
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
                <TableHead>To</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginate(filtered, page, PER_PAGE).map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="text-sm">{email.to_email}</TableCell>
                  <TableCell className="text-sm max-w-xs truncate">{email.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{email.template}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[email.status] || ""}>{email.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(email.sent_at).toLocaleString("en-MY")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => resendEmail(email)}
                      title="Resend"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No email logs found
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
