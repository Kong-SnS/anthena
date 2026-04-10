import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { FloatingPetals } from "@/components/ui/floating-petals"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { BackToTop } from "@/components/ui/back-to-top"
import { SocialProof } from "@/components/ui/social-proof"
import { CartDrawer } from "@/components/layout/cart-drawer"
import { I18nProvider } from "@/lib/i18n"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <LoadingScreen />
      <ScrollProgress />
      <FloatingPetals />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <SocialProof />
      <CartDrawer />
    </I18nProvider>
  )
}
