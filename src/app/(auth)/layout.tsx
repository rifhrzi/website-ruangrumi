import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Ruang Rumi - Account",
  description:
    "Sign in or create your Ruang Rumi account for a premium cafe experience.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-cream-50">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 gradient-coffee" />
        <div className="absolute inset-0 bg-[url('/images/pattern-coffee.svg')] opacity-5" />
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Top branding */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Logo variant="light" size="lg" />
            </Link>
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                Where Every Sip
                <br />
                <span className="text-gold-400">Tells a Story</span>
              </h1>
              <p className="text-lg text-cream-300/90 max-w-md leading-relaxed">
                Experience artisan coffee, a curated menu, and a cozy ambience
                crafted for moments that matter.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                {
                  title: "Artisan Coffee",
                  desc: "Handcrafted with premium beans",
                },
                {
                  title: "Curated Menu",
                  desc: "From pastries to main courses",
                },
                {
                  title: "Easy Reservations",
                  desc: "Book your table in seconds",
                },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-gold-400 shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">
                      {feature.title}
                    </p>
                    <p className="text-cream-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="space-y-4">
            <div className="w-16 h-px bg-gold-400/40" />
            <blockquote className="text-cream-200/80 text-sm italic leading-relaxed max-w-sm">
              &ldquo;Ruang Rumi isn&apos;t just a cafe, it&apos;s a sanctuary
              for the soul. The coffee is exceptional and the atmosphere is
              unmatched.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-coffee-400/30 flex items-center justify-center text-xs font-semibold text-cream-200">
                AP
              </div>
              <div>
                <p className="text-cream-200 text-sm font-medium">
                  Aditya Pratama
                </p>
                <p className="text-cream-400 text-xs">Loyal Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form area */}
      <div className="flex flex-col w-full lg:w-1/2 xl:w-[55%]">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Logo variant="dark" size="md" />
          </Link>
          <Link
            href="/"
            className="text-sm text-coffee-500 hover:text-coffee-600 font-medium transition-colors">
            Back to Home
          </Link>
        </div>

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center border-t border-cream-200">
          <p className="text-xs text-coffee-300">
            &copy; 2026 Ruang Rumi. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
