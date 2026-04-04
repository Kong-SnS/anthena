import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ billplz_id?: string }>
}) {
  const { billplz_id } = await searchParams
  let order = null

  if (billplz_id) {
    const supabase = await createClient()
    const { data } = await supabase
      .from("orders")
      .select("order_number, total, subtotal, shipping_cost, status, order_items(product_name, quantity, unit_price)")
      .eq("billplz_bill_id", billplz_id)
      .single()
    order = data
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-gold" />
            </div>
            <h1 className="text-[40px] font-display font-normal tracking-tight mb-2">
              Order Confirmed
            </h1>
            <p className="text-muted-foreground font-light text-base">
              Thank you for your purchase!
            </p>
          </div>

          {order && (
            <div className="bg-[#faf8f5] p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                  Order #{order.order_number}
                </span>
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-gold">
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.order_items?.map((item: { product_name: string; quantity: number; unit_price: number }, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-light">
                      {item.product_name} &times;{item.quantity}
                    </span>
                    <span>RM {(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-gold/5 my-3" />

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-light">Subtotal</span>
                  <span>RM {Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-light">Shipping</span>
                  <span>RM {Number(order.shipping_cost).toFixed(2)}</span>
                </div>
              </div>

              <Separator className="bg-gold/5 my-3" />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>RM {Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          )}

          {!order && billplz_id && (
            <p className="text-base text-muted-foreground text-center mb-8 font-light">
              Reference: {billplz_id}
            </p>
          )}

          <p className="text-base text-muted-foreground font-light text-center mb-8 leading-relaxed">
            A confirmation email with your order details will be sent shortly.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="rounded-none px-8 h-11 text-xs font-medium tracking-[0.1em] uppercase border-gold/20"
              render={<Link href="/" />}
            >
              Home
            </Button>
            <Button
              className="btn-rose-gold rounded-none px-8 h-11 text-xs font-medium tracking-[0.1em] uppercase"
              render={<Link href="/shop" />}
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
