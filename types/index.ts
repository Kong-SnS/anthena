export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  compare_price: number | null
  images: string[]
  category: string
  stock_count: number
  weight_kg: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  user_id: string | null
  email: string
  name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postcode: string
  country: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping_cost: number
  total: number
  shipping_method: string | null
  tracking_number: string | null
  easyparcel_order_id: string | null
  billplz_bill_id: string | null
  billplz_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  customer?: Customer
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  product?: Product
}

export interface Invoice {
  id: string
  order_id: string
  invoice_number: string
  issued_at: string
  pdf_url: string | null
  sent_at: string | null
  order?: Order
}

export interface EmailLog {
  id: string
  order_id: string | null
  customer_id: string | null
  to_email: string
  subject: string
  template: string
  mailgun_message_id: string | null
  status: 'sent' | 'delivered' | 'bounced' | 'failed'
  sent_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: 'admin' | 'customer'
  created_at: string
}

export interface CartItem {
  product_id: string
  product: Product
  quantity: number
}

export interface ShippingRate {
  courier_name: string
  service_name: string
  price: number
  estimated_days: string
}
