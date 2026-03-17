"use client";

import { Coffee, Sofa, CakeSlice, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/hooks/use-in-view";

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    id: "premium-beans",
    icon: Coffee,
    title: "Premium Beans",
    description:
      "Single origin beans, freshly roasted in-house every week. We source from the finest farms across the Indonesian archipelago and beyond.",
    accent: "group-hover:text-coffee-500",
    iconBg:
      "bg-coffee-100 text-coffee-600 group-hover:bg-coffee-500 group-hover:text-white",
  },
  {
    id: "cozy-ambience",
    icon: Sofa,
    title: "Cozy Ambience",
    description:
      "Designed for comfort and productivity. Whether you are catching up with friends or deep in work, our space adapts to your mood.",
    accent: "group-hover:text-brown-700",
    iconBg:
      "bg-brown-500/10 text-brown-700 group-hover:bg-brown-700 group-hover:text-white",
  },
  {
    id: "artisan-pastry",
    icon: CakeSlice,
    title: "Artisan Pastry",
    description:
      "Freshly baked daily by our in-house pastry chef. From flaky croissants to decadent cakes, every bite is a celebration.",
    accent: "group-hover:text-gold-600",
    iconBg:
      "bg-gold-500/10 text-gold-600 group-hover:bg-gold-500 group-hover:text-white",
  },
  {
    id: "easy-reservation",
    icon: CalendarCheck,
    title: "Easy Reservation",
    description:
      "Book your table online instantly. Choose your preferred area, time slot, and party size -- all in a few taps.",
    accent: "group-hover:text-coffee-500",
    iconBg:
      "bg-coffee-200/50 text-coffee-500 group-hover:bg-coffee-500 group-hover:text-white",
  },
];

export default function FeaturesSection() {
  const { ref: headerRef, isInView: headerInView } = useInView({
    threshold: 0.2,
  });
  const { ref: gridRef, isInView: gridInView } = useInView({ threshold: 0.1 });

  return (
    <section
      className="relative overflow-hidden bg-cream-100 py-20 sm:py-28"
      aria-labelledby="features-heading">
      {/* Decorative blobs */}
      <div
        className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-coffee-100/30 blur-3xl"
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
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brown-700/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-cream-100">
            Why Us
          </span>
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tight text-brown-900 sm:text-4xl lg:text-5xl">
            Why Choose <span className="text-coffee-500">Ruang Rumi</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brown-700/70 sm:text-lg">
            More than a cafe -- it is a destination. Here is what makes every
            visit special.
          </p>
          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-12 bg-coffee-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-coffee-400" />
            <span className="h-px w-12 bg-coffee-300" />
          </div>
        </div>

        {/* Features Grid */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.id}
                className={cn(
                  "group relative flex flex-col items-center rounded-2xl p-7 text-center",
                  "bg-cream-50 border border-cream-200/60",
                  "transition-all duration-500",
                  "hover:bg-white hover:shadow-xl hover:shadow-brown-900/5 hover:-translate-y-1",
                  "hover:border-cream-300",
                  gridInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                )}
                style={{
                  transitionDelay: gridInView ? `${index * 100}ms` : "0ms",
                }}>
                {/* Icon */}
                <div
                  className={cn(
                    "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
                    feature.iconBg,
                  )}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "text-lg font-bold text-brown-900 transition-colors duration-200",
                    feature.accent,
                  )}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-brown-700/70">
                  {feature.description}
                </p>

                {/* Decorative bottom line */}
                <div
                  className="mt-5 h-1 w-10 rounded-full bg-cream-300 transition-all duration-300 group-hover:w-16 group-hover:bg-coffee-400"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
