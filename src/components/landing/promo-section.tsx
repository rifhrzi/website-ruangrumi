"use client";

import Link from "next/link";
import { Gift, Clock, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/hooks/use-in-view";

interface Promo {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight: string;
  cta: string;
  href: string;
  gradient: string;
  iconBg: string;
}

const promos: Promo[] = [
  {
    id: "paket-hemat",
    icon: Gift,
    title: "Paket Hemat",
    description:
      "Nikmati kombinasi sempurna coffee favorit dan butter croissant kami yang renyah dalam satu paket spesial.",
    highlight: "Coffee + Croissant Rp 55.000",
    cta: "Order Paket",
    href: "/menu",
    gradient: "from-coffee-400/15 via-coffee-200/10 to-transparent",
    iconBg: "bg-coffee-500/15 text-coffee-500",
  },
  {
    id: "happy-hour",
    icon: Clock,
    title: "Happy Hour",
    description:
      "Setiap hari pukul 3 hingga 5 sore, semua minuman diskon 20%. Waktu yang tepat untuk rehat sejenak.",
    highlight: "3 - 5 PM  |  20% Off All Drinks",
    cta: "Lihat Menu",
    href: "/menu",
    gradient: "from-gold-500/15 via-gold-400/10 to-transparent",
    iconBg: "bg-gold-500/15 text-gold-600",
  },
  {
    id: "weekend-brunch",
    icon: Sparkles,
    title: "Weekend Brunch Special",
    description:
      "Sabtu dan Minggu, nikmati brunch eksklusif dengan pilihan menu spesial dan free flow coffee.",
    highlight: "Sat - Sun  |  10 AM - 2 PM",
    cta: "Reservasi Sekarang",
    href: "/reservation",
    gradient: "from-brown-700/10 via-brown-600/5 to-transparent",
    iconBg: "bg-brown-700/15 text-brown-800",
  },
];

export default function PromoSection() {
  const { ref: headerRef, isInView: headerInView } = useInView({
    threshold: 0.2,
  });
  const { ref: gridRef, isInView: gridInView } = useInView({ threshold: 0.1 });

  return (
    <section
      className="relative overflow-hidden bg-cream-100 py-20 sm:py-28"
      aria-labelledby="promo-heading">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(201,169,110,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(150,115,74,0.06) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "flex flex-col items-center text-center transition-all duration-700 ease-out",
            headerInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8",
          )}>
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-600">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Special Offers
          </span>
          <h2
            id="promo-heading"
            className="text-3xl font-bold tracking-tight text-brown-900 sm:text-4xl lg:text-5xl">
            Promo &amp; Deals
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brown-700/70 sm:text-lg">
            Exclusive offers crafted to make your cafe experience even more
            delightful. Do not miss out.
          </p>
          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-12 bg-gold-500/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            <span className="h-px w-12 bg-gold-500/40" />
          </div>
        </div>

        {/* Promo Cards */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {promos.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <article
                key={promo.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl",
                  "bg-cream-50 border border-cream-200",
                  "p-6 sm:p-8",
                  "shadow-sm transition-all duration-500",
                  "hover:shadow-xl hover:shadow-brown-900/5 hover:-translate-y-1",
                  gridInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                )}
                style={{
                  transitionDelay: gridInView ? `${index * 120}ms` : "0ms",
                }}>
                {/* Gradient background */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    promo.gradient,
                  )}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-1 flex-col">
                  {/* Icon */}
                  <div
                    className={cn(
                      "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      promo.iconBg,
                    )}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-brown-900">
                    {promo.title}
                  </h3>

                  {/* Highlight tag */}
                  <div className="mt-3 inline-flex self-start rounded-lg bg-cream-100 px-3 py-1.5 text-sm font-semibold text-coffee-600 border border-cream-200">
                    {promo.highlight}
                  </div>

                  {/* Description */}
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-brown-700/70">
                    {promo.description}
                  </p>

                  {/* CTA */}
                  <Link
                    href={promo.href}
                    className={cn(
                      "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold",
                      "text-coffee-500 transition-colors duration-200",
                      "hover:text-coffee-600",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 rounded-sm",
                    )}>
                    {promo.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
