import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { FloatingPetals } from "@/components/ui/floating-petals"
import { I18nProvider } from "@/lib/i18n"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <FloatingPetals />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </I18nProvider>
  )
}
