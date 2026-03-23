"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Trash2, Upload, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const isNew = id === "new"

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    compare_price: "",
    category: "",
    stock_count: "0",
    weight_kg: "0.5",
    is_active: true,
  })

  useEffect(() => {
    if (isNew) return
    async function load() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase.from("products").select("*").eq("id", id).single()
      if (data) {
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description,
          price: data.price.toString(),
          compare_price: data.compare_price?.toString() || "",
          category: data.category,
          stock_count: data.stock_count.toString(),
          weight_kg: data.weight_kg.toString(),
          is_active: data.is_active,
        })
        setImages(data.images || [])
      }
      setLoading(false)
    }
    load()
  }, [id, isNew])

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    const supabase = createClient()
    const newImages: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage.from("product-images").upload(path, file)

      if (error) {
        toast.error(`Upload failed: ${error.message}`)
        continue
      }

      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path)
      newImages.push(publicUrl)
    }

    setImages((prev) => [...prev, ...newImages])
    setUploading(false)
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Name, price, and category are required")
      return
    }

    setSaving(true)
    const supabase = createClient()

    const productData = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description,
      short_description: form.short_description,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category: form.category,
      stock_count: parseInt(form.stock_count),
      weight_kg: parseFloat(form.weight_kg),
      is_active: form.is_active,
      images,
      updated_at: new Date().toISOString(),
    }

    let error
    if (isNew) {
      ;({ error } = await supabase.from("products").insert(productData))
    } else {
      ;({ error } = await supabase.from("products").update(productData).eq("id", id))
    }

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isNew ? "Product created" : "Product updated")
      router.push("/admin/products")
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return
    const supabase = createClient()
    await supabase.from("products").delete().eq("id", id)
    toast.success("Product deleted")
    router.push("/admin/products")
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{isNew ? "Add Product" : "Edit Product"}</h1>
        {!isNew && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  updateField("name", e.target.value)
                  if (isNew) updateField("slug", generateSlug(e.target.value))
                }}
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />
            </div>
            <div>
              <Label>Short Description</Label>
              <Input value={form.short_description} onChange={(e) => updateField("short_description", e.target.value)} />
            </div>
            <div>
              <Label>Full Description</Label>
              <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} />
            </div>
            <div>
              <Label>Category *</Label>
              <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="e.g., Vitamins" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing & Stock</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (RM) *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
              </div>
              <div>
                <Label>Compare Price (RM)</Label>
                <Input type="number" step="0.01" value={form.compare_price} onChange={(e) => updateField("compare_price", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock Count</Label>
                <Input type="number" value={form.stock_count} onChange={(e) => updateField("stock_count", e.target.value)} />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.01" value={form.weight_kg} onChange={(e) => updateField("weight_kg", e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked as boolean)}
              />
              <Label htmlFor="is_active">Active (visible in store)</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square bg-muted rounded overflow-hidden group">
                    <Image src={img} alt={`Product ${idx + 1}`} fill className="object-cover" sizes="120px" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div>
              <Label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded text-sm hover:bg-muted transition-colors">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Images"}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </Label>
              <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WebP. You can also enter image URLs directly in the database.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isNew ? "Create Product" : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
