"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Flame } from "lucide-react";
import { menuItems } from "@/lib/data/menu";
import { formatCurrency, cn } from "@/lib/utils";
import AnimatedSection from "@/components/ui/animated-section";
import { useInView } from "@/lib/hooks/use-in-view";

const bestSellers = menuItems.filter((item) => item.isBestSeller);

function BestSellerCard({
  item,
  index,
}: {
  item: (typeof bestSellers)[number];
  index: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <article
      ref={ref}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "glass-card",
        "shadow-sm transition-all duration-500",
        "hover:shadow-2xl hover:shadow-brown-900/10 hover:-translate-y-2",
        "hover:glow-gold",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      )}
      style={{ transitionDelay: isInView ? `${index * 120}ms` : "0ms" }}>
      {/* Gradient border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{
        background: "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(212,175,55,0.08), rgba(150,115,74,0.1))",
      }} aria-hidden="true" />

      {/* Image placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-coffee-200 via-coffee-300 to-coffee-500">
        {/* Pattern texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
        {/* Gradient overlay for depth */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"
          aria-hidden="true"
        />
        {/* Shine sweep on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animation: 'shine-sweep 2s ease-in-out' }} />
        </div>
        {/* Image */}
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Best Seller badge */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-3 py-1.5 text-xs font-bold text-brown-900 shadow-lg shadow-gold-500/25"
          style={{ animation: 'badge-pulse 2s ease-in-out infinite' }}>
          <Flame className="h-3 w-3" aria-hidden="true" />
          Best Seller
        </div>

        {/* Rating badge */}
        {item.rating && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brown-900/60 px-2.5 py-1 text-xs font-semibold text-cream-50 backdrop-blur-md border border-white/10">
            <Star
              className="h-3 w-3 fill-gold-400 text-gold-400"
              aria-hidden="true"
            />
            {item.rating}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-brown-900 group-hover:text-coffee-500 transition-colors duration-300">
          {item.name}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-brown-700/60 line-clamp-2">
          {item.description}
        </p>

        {/* Price and orders */}
        <div className="mt-4 flex items-center justify-between border-t border-cream-200/60 pt-4">
          <span className="text-lg font-bold bg-gradient-to-r from-coffee-500 to-coffee-400 bg-clip-text text-transparent">
            {formatCurrency(item.price)}
          </span>
          {item.totalOrders && (
            <span className="text-xs text-brown-700/40 flex items-center gap-1">
              <Flame className="h-3 w-3 text-coffee-400/50" aria-hidden="true" />
              {item.totalOrders.toLocaleString("id-ID")} orders
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function BestSellerSection() {
  return (
    <AnimatedSection
      className="relative overflow-hidden bg-cream-50 pb-20 pt-12 sm:pb-28 sm:pt-16"
      ariaLabelledby="best-sellers-heading">
      {/* Decorative background elements - enhanced */}
      <div
        className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-coffee-100/30 blur-3xl animate-float-gentle"
        aria-hidden="true"
      />
      <div
        className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-gold-500/8 blur-3xl animate-float-gentle animation-delay-300"
        aria-hidden="true"
      />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(rgba(42,31,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(42,31,23,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-coffee-100/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-coffee-600 border border-coffee-200/40">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            Most Loved
          </span>
          <h2
            id="best-sellers-heading"
            className="font-heading text-3xl font-bold tracking-tight text-brown-900 sm:text-4xl lg:text-5xl">
            Best Sellers
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brown-700/60 sm:text-lg">
            The crowd favorites our guests keep coming back for. Handcrafted
            with passion, loved by everyone.
          </p>
          {/* Decorative divider - enhanced */}
          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-coffee-300" />
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-gold-400 to-coffee-400" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-coffee-300" />
          </div>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bestSellers.map((item, index) => (
            <BestSellerCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* CTA - enhanced */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/menu"
            className={cn(
              "group inline-flex items-center gap-2.5 rounded-full px-9 py-4",
              "bg-brown-800 text-cream-50 font-semibold text-sm",
              "transition-all duration-300",
              "shadow-lg shadow-brown-900/10",
              "hover:bg-brown-900 hover:shadow-xl hover:shadow-brown-900/20 hover:scale-[1.03]",
              "active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-700 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50",
            )}>
            View Full Menu
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
