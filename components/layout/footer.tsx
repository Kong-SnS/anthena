import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-warm-dark text-white">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <h3 className="text-2xl font-light tracking-[0.3em] uppercase mb-6">
              Anthena
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm font-light">
              Affordable premium wellness. Crafted with the finest botanicals
              from France, USA, Spain, and Asia.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/bloomie_int/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 text-sm hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/#about", label: "About" },
                { href: "/cart", label: "Cart" },
                { href: "/#testimonials", label: "Reviews" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50 mb-6">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/60126431737?text=PMBloomie"
                  className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                >
                  WhatsApp: 012-643 1737
                </a>
              </li>
              <li>
                <a
                  href="mailto:woosisterstrading@gmail.com"
                  className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                >
                  woosisterstrading@gmail.com
                </a>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/45 text-xs font-light tracking-wider">
            &copy; {new Date().getFullYear()} Athena Healthcare (PG0565925W). All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-white/45 text-xs font-light tracking-wider">
              Privacy Policy
            </span>
            <span className="text-white/45 text-xs font-light tracking-wider">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
