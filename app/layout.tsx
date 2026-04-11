import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const siteUrl = "https://www.boomingwellness.com.my"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bloomie by Athena | Premium Women's Wellness Supplement",
    template: "%s | Athena",
  },
  description:
    "Bloomie by Athena: premium women's wellness supplement with 12 patented ingredients. Relieves menstrual cramps, hormonal acne & mood swings.",
  keywords: [
    "Bloomie",
    "Athena",
    "women's wellness",
    "menstrual relief",
    "hormonal balance",
    "PCOS supplement",
    "women's health Malaysia",
    "menstrual cramps",
    "hormonal acne",
    "patented formula",
    "French formula supplement",
  ],
  authors: [{ name: "Athena Healthcare" }],
  creator: "Athena Healthcare",
  publisher: "Athena Healthcare",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: siteUrl,
    siteName: "Athena",
    title: "Bloomie by Athena | Premium Women's Wellness Supplement",
    description:
      "12 patented ingredients for women's hormonal health. Relieves menstrual cramps, PCOS, hormonal acne & more. Clinically proven results in 1 week.",
    images: [
      {
        url: "/images/products/bloomie-product-new.png",
        width: 1200,
        height: 1200,
        alt: "Bloomie by Athena - Premium Women's Wellness Supplement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloomie by Athena | Premium Women's Wellness",
    description:
      "12 patented ingredients for women's hormonal health. Free shipping on 2 boxes.",
    images: ["/images/products/bloomie-product-new.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
