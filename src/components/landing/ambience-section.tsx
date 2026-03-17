"use client";

import Link from "next/link";
import {
  Camera,
  ArrowRight,
  Armchair,
  TreePine,
  Crown,
  Wine,
  Lamp,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/hooks/use-in-view";

interface SpaceArea {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  span?: string;
}

const spaces: SpaceArea[] = [
  {
    id: "indoor-main",
    label: "Indoor Lounge",
    description: "Warm lighting and plush seating",
    icon: Armchair,
    gradient: "from-coffee-300 via-coffee-400 to-brown-600",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: "outdoor-garden",
    label: "Garden Terrace",
    description: "Fresh air and natural greenery",
    icon: TreePine,
    gradient: "from-coffee-200 via-coffee-300 to-coffee-500",
  },
  {
    id: "vip-room",
    label: "VIP Room",
    description: "Private and exclusive",
    icon: Crown,
    gradient: "from-brown-700 via-brown-800 to-brown-900",
  },
  {
    id: "bar-area",
    label: "Coffee Bar",
    description: "Watch the baristas at work",
    icon: Wine,
    gradient: "from-coffee-400 via-brown-500 to-brown-700",
  },
  {
    id: "reading-nook",
    label: "Reading Nook",
    description: "Quiet corner for focus time",
    icon: Lamp,
    gradient: "from-coffee-200 via-coffee-300 to-coffee-400",
  },
  {
    id: "live-corner",
    label: "Live Music Corner",
    description: "Weekend acoustic sessions",
    icon: Music,
    gradient: "from-brown-600 via-brown-700 to-charcoal-800",
  },
];

export default function AmbienceSection() {
  const { ref: headerRef, isInView: headerInView } = useInView({
    threshold: 0.2,
  });
  const { ref: gridRef, isInView: gridInView } = useInView({ threshold: 0.05 });

  return (
    <section
      className="relative overflow-hidden bg-cream-50 py-20 sm:py-28"
      aria-labelledby="ambience-heading">
      {/* Decorative background */}
      <div
        className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-cream-200/40 blur-3xl"
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
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            Our Space
          </span>
          <h2
            id="ambience-heading"
            className="text-3xl font-bold tracking-tight text-brown-900 sm:text-4xl lg:text-5xl">
            Experience Our Space
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brown-700/70 sm:text-lg">
            Every corner of Ruang Rumi is thoughtfully designed to create the
            perfect atmosphere for any occasion.
          </p>
          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-12 bg-coffee-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-coffee-400" />
            <span className="h-px w-12 bg-coffee-300" />
          </div>
        </div>

        {/* Image Grid */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-4 auto-rows-[200px] sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[180px] md:grid-flow-dense">
          {spaces.map((space, index) => {
            const Icon = space.icon;
            return (
              <div
                key={space.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl",
                  "transition-all duration-500",
                  "hover:shadow-xl hover:shadow-brown-900/10 hover:-translate-y-0.5",
                  space.span,
                  gridInView
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-6 scale-[0.97]",
                )}
                style={{
                  transitionDelay: gridInView ? `${index * 80}ms` : "0ms",
                }}>
                {/* Gradient background (placeholder for images) */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
                    space.gradient,
                  )}
                  aria-hidden="true"
                />

                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                  aria-hidden="true"
                />

                {/* Camera icon (top-right) */}
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Camera
                    className="h-4 w-4 text-cream-50"
                    aria-hidden="true"
                  />
                </div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/10 p-5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon
                      className="h-8 w-8 text-cream-50/80"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Bottom label overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-10">
                  <h3 className="text-sm font-bold text-cream-50 sm:text-base">
                    {space.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-cream-200/80">
                    {space.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/reservation"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full px-8 py-3.5",
              "bg-brown-800 text-cream-50 font-semibold text-sm",
              "transition-all duration-300",
              "hover:bg-brown-900 hover:shadow-lg hover:shadow-brown-900/15",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-700 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50",
            )}>
            Reserve Your Spot
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
