import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { FloatingPetals } from "@/components/ui/floating-petals"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { SmoothScroll } from "@/components/ui/smooth-scroll"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { BackToTop } from "@/components/ui/back-to-top"
import { SocialProof } from "@/components/ui/social-proof"
import { StickyProductBar } from "@/components/ui/sticky-product-bar"
import { EmailPopup } from "@/components/ui/email-popup"
import { CartDrawer } from "@/components/layout/cart-drawer"
import { ColorDemo } from "@/components/ui/color-demo"
import { I18nProvider } from "@/lib/i18n"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <LoadingScreen />
      <SmoothScroll />
      <ScrollProgress />
      <FloatingPetals />
      <AnnouncementBar />
      <Navbar />
      <StickyProductBar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <SocialProof />
      <EmailPopup />
      <CartDrawer />
      <ColorDemo />
    </I18nProvider>
  )
}
