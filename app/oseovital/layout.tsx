import type { Metadata } from "next"

const siteUrl = "https://www.boomingwellness.com.my"

export const metadata: Metadata = {
  title: "OseoVital | Premium Joint & Bone Health Supplement",
  description:
    "OseoVital supports joint health and bone strength with clinically proven ingredients from Switzerland and Japan. Relief for joint pain, stiffness and mobility.",
  alternates: {
    canonical: `${siteUrl}/oseovital`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/oseovital`,
    title: "OseoVital | Premium Joint & Bone Health Supplement",
    description:
      "Advanced botanical formula for joint comfort, bone strength, and mobility. Clinically proven ingredients from Switzerland and Japan.",
    images: [
      {
        url: "/images/oseo-vital-product.png",
        width: 1200,
        height: 1200,
        alt: "OseoVital - Premium Joint & Bone Health Supplement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OseoVital | Premium Joint & Bone Health Supplement",
    description:
      "Advanced botanical formula for joint comfort, bone strength, and mobility. Clinically proven ingredients.",
    images: ["/images/oseo-vital-product.png"],
  },
}

export default function OseoVitalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
