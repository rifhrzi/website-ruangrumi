"use client";

import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/hooks/use-in-view";

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  role: string;
  quote: string;
  rating: number;
  avatarColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Anya Prasetya",
    initials: "AP",
    role: "Regular Guest",
    quote:
      "Ruang Rumi is my go-to place for everything. The signature latte is divine, and the ambience is perfect for getting work done or catching up with friends. Truly a hidden gem in the city.",
    rating: 5,
    avatarColor: "bg-coffee-400 text-cream-50",
  },
  {
    id: "testimonial-2",
    name: "Budi Hartono",
    initials: "BH",
    role: "Coffee Enthusiast",
    quote:
      "As someone who is particular about coffee, I am impressed by the quality here. The single origin espresso is top-notch, and you can tell they really care about their craft. The pastries are the perfect complement.",
    rating: 5,
    avatarColor: "bg-brown-700 text-cream-50",
  },
  {
    id: "testimonial-3",
    name: "Citra Dewi",
    initials: "CD",
    role: "Food Blogger",
    quote:
      "From the stunning interior to the beautifully plated dishes, Ruang Rumi delivers on every level. The truffle mushroom pasta is a must-try, and their tiramisu is the best I have had in Jakarta.",
    rating: 5,
    avatarColor: "bg-gold-500 text-brown-900",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-gold-400 text-gold-400"
              : "fill-cream-300 text-cream-300",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function TestimonialSection() {
  const { ref: headerRef, isInView: headerInView } = useInView({
    threshold: 0.2,
  });
  const { ref: gridRef, isInView: gridInView } = useInView({ threshold: 0.1 });

  return (
    <section
      className="relative overflow-hidden bg-cream-50 py-20 sm:py-28"
      aria-labelledby="testimonials-heading">
      {/* Decorative elements */}
      <div
        className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-3xl"
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
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-600">
            <Quote className="h-3.5 w-3.5" aria-hidden="true" />
            Testimonials
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-brown-900 sm:text-4xl lg:text-5xl">
            What Our Guests Say
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brown-700/70 sm:text-lg">
            Real stories from our beloved guests. Their words inspire us to keep
            raising the bar.
          </p>
          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-12 bg-gold-500/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            <span className="h-px w-12 bg-gold-500/30" />
          </div>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={cn(
                "group relative flex flex-col rounded-2xl p-7 sm:p-8",
                "bg-cream-50 border border-cream-200",
                "shadow-sm transition-all duration-500",
                "hover:shadow-xl hover:shadow-brown-900/5 hover:-translate-y-1",
                gridInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
              style={{
                transitionDelay: gridInView ? `${index * 120}ms` : "0ms",
              }}>
              {/* Quote icon */}
              <Quote
                className="mb-4 h-8 w-8 text-coffee-200 transition-colors duration-300 group-hover:text-coffee-300"
                aria-hidden="true"
              />

              {/* Quote text */}
              <blockquote className="flex-1">
                <p className="text-sm leading-relaxed text-brown-700/80 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>

              {/* Rating */}
              <div className="mt-5">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 border-t border-cream-200 pt-5">
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold shrink-0",
                    testimonial.avatarColor,
                  )}
                  aria-hidden="true">
                  {testimonial.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brown-900 truncate">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-brown-700/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
