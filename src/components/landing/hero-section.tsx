import Link from "next/link";
import { ArrowRight, Coffee, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      aria-label="Hero">
      {/* Base gradient background */}
      <div className="absolute inset-0 gradient-coffee" aria-hidden="true" />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-40 animate-gradient-shift"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #2A1F17 0%, #4A3728 25%, #6B4423 50%, #3D2E22 75%, #2A1F17 100%)",
          backgroundSize: "400% 400%",
        }}
        aria-hidden="true"
      />

      {/* Grain texture overlay for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />

      {/* Radial spotlight effects */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(201,169,110,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 75% 30%, rgba(150,115,74,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 50% 90%, rgba(212,175,55,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-brown-900/40" aria-hidden="true" />

      {/* Floating decorative elements - enhanced */}
      <div
        className="absolute left-10 top-1/4 h-72 w-72 rounded-full bg-gold-500/8 blur-3xl animate-float-gentle"
        aria-hidden="true"
      />
      <div
        className="absolute right-10 bottom-1/4 h-96 w-96 rounded-full bg-coffee-500/6 blur-3xl animate-float-gentle animation-delay-400"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/3 top-1/6 h-48 w-48 rounded-full bg-gold-400/6 blur-2xl animate-pulse-soft"
        aria-hidden="true"
      />
      <div
        className="absolute right-1/4 bottom-1/3 h-56 w-56 rounded-full bg-cream-200/5 blur-2xl animate-pulse-soft animation-delay-200"
        aria-hidden="true"
      />

      {/* Decorative geometric accents */}
      <div className="absolute left-[15%] top-[20%] h-px w-24 bg-gradient-to-r from-transparent via-gold-400/20 to-transparent rotate-45 animate-pulse-soft" aria-hidden="true" />
      <div className="absolute right-[20%] top-[35%] h-px w-32 bg-gradient-to-r from-transparent via-cream-200/15 to-transparent -rotate-12 animate-pulse-soft animation-delay-300" aria-hidden="true" />
      <div className="absolute left-[10%] bottom-[30%] h-px w-20 bg-gradient-to-r from-transparent via-gold-500/15 to-transparent rotate-[30deg] animate-pulse-soft animation-delay-500" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge - with shimmer effect */}
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-brown-900/40 px-5 py-2.5 backdrop-blur-xl animate-glow-pulse">
            <Sparkles className="h-4 w-4 text-gold-400" aria-hidden="true" />
            <span className="text-sm font-medium tracking-wide text-shimmer">
              Premium Cafe Experience
            </span>
            <Star
              className="h-3 w-3 fill-gold-400 text-gold-400"
              aria-hidden="true"
            />
          </div>

          {/* Headline - with Playfair Display */}
          <h1 className="animate-fade-in-up animation-delay-100 max-w-4xl text-balance font-heading text-5xl font-bold leading-[1.1] tracking-tight text-cream-50 sm:text-6xl md:text-7xl lg:text-8xl">
            Where Every Sip{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-shimmer">
                Tells a Story
              </span>
              {/* Animated underline glow */}
              <span
                className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-gold-400/0 via-gold-400 to-gold-400/0 animate-pulse-soft"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-2 left-0 right-0 h-4 bg-gold-500/10 blur-md"
                aria-hidden="true"
              />
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-in-up animation-delay-200 mt-8 max-w-2xl text-balance text-lg leading-relaxed text-cream-200/80 sm:text-xl">
            Experience the art of handcrafted coffee in a space designed for
            comfort, conversation, and creativity. From single-origin beans to
            artisan pastries, every detail is curated with care.
          </p>

          {/* CTA Buttons - enhanced */}
          <div className="animate-fade-in-up animation-delay-300 mt-12 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/menu"
              className={cn(
                "group inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-4",
                "bg-gradient-to-r from-gold-500 to-gold-400 text-brown-900 font-semibold text-base",
                "transition-all duration-300",
                "shadow-lg shadow-gold-500/20",
                "hover:shadow-xl hover:shadow-gold-500/35 hover:scale-[1.03]",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900",
              )}>
              Order Sekarang
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/reservation"
              className={cn(
                "group inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-4",
                "border border-cream-200/20 text-cream-50 font-semibold text-base",
                "backdrop-blur-md transition-all duration-300",
                "hover:border-gold-400/40 hover:bg-gold-400/5 hover:scale-[1.03]",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-200 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900",
              )}>
              Reservasi Meja
            </Link>
          </div>

          {/* Stats row - enhanced with icons and glowing dividers */}
          <div className="animate-fade-in-up animation-delay-500 mt-20 grid grid-cols-3 gap-8 sm:gap-16">
            {[
              { value: "50+", label: "Menu Items", icon: Coffee },
              { value: "4.9", label: "Rating", icon: Star },
              { value: "10K+", label: "Happy Guests", icon: Sparkles },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="relative flex flex-col items-center">
                  {/* Glowing divider line */}
                  {index > 0 && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 h-12 w-px bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" aria-hidden="true" />
                  )}
                  <Icon className="mb-2 h-4 w-4 text-gold-400/60" aria-hidden="true" />
                  <span className="text-2xl font-bold font-heading text-gold-400 sm:text-3xl lg:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 text-xs text-cream-300/60 sm:text-sm tracking-wide">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream-50 via-cream-50/50 to-transparent"
        aria-hidden="true"
      />

      {/* Scroll indicator - enhanced with bounce */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-700"
        aria-hidden="true">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-cream-300/40 font-medium">
            Scroll
          </span>
          <div className="relative h-10 w-[1.5px]">
            <div className="absolute inset-0 bg-gradient-to-b from-cream-300/40 to-transparent" />
            <div className="absolute top-0 left-0 h-4 w-full bg-gradient-to-b from-gold-400/60 to-transparent" style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
