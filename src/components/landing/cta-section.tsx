'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Phone, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks/use-in-view';

export default function CtaSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-brown-900 py-20 sm:py-28"
      aria-label="Call to action"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-70 animate-gradient-shift"
        style={{
          backgroundImage: 'linear-gradient(135deg, #2A1F17 0%, #4A3728 20%, #6B4423 40%, #4A3728 60%, #3D2E22 80%, #2A1F17 100%)',
          backgroundSize: '400% 400%',
        }}
        aria-hidden="true"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
        aria-hidden="true"
      />

      {/* Glowing orbs */}
      <div
        className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gold-500/8 blur-3xl animate-float-gentle"
        aria-hidden="true"
      />
      <div
        className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-coffee-500/8 blur-3xl animate-float-gentle animation-delay-400"
        aria-hidden="true"
      />

      {/* Sparkle decorations */}
      <div className="absolute left-[15%] top-[25%] text-gold-400/15 animate-pulse-soft" aria-hidden="true">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="absolute right-[20%] top-[20%] text-cream-200/10 animate-pulse-soft animation-delay-300" aria-hidden="true">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="absolute left-[25%] bottom-[20%] text-gold-500/10 animate-pulse-soft animation-delay-500" aria-hidden="true">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="absolute right-[15%] bottom-[30%] text-cream-300/10 animate-pulse-soft animation-delay-200" aria-hidden="true">
        <Sparkles className="h-3 w-3" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div
          className={cn(
            'transition-all duration-700 ease-out',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight text-cream-50 sm:text-4xl lg:text-5xl xl:text-6xl">
            Ready for a{' '}
            <span className="text-shimmer">
              Perfect Cup
            </span>
            ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream-300/70">
            Visit us today or reserve your table online. We are waiting to make
            your day a little better, one sip at a time.
          </p>

          {/* Buttons - enhanced with glow */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <Link
              href="/reservation"
              className={cn(
                'group inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-4',
                'bg-gradient-to-r from-gold-500 to-gold-400 text-brown-900 font-semibold text-base',
                'transition-all duration-300',
                'shadow-lg shadow-gold-500/20',
                'hover:shadow-xl hover:shadow-gold-500/35 hover:scale-[1.03]',
                'active:scale-[0.98]'
              )}
            >
              Reservasi Meja
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/menu"
              className={cn(
                'inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-4',
                'border border-cream-200/20 text-cream-50 font-semibold text-base',
                'backdrop-blur-md transition-all duration-300',
                'hover:border-gold-400/40 hover:bg-gold-400/5 hover:scale-[1.03]',
                'active:scale-[0.98]'
              )}
            >
              Lihat Menu
            </Link>
          </div>

          {/* Contact quick info - enhanced */}
          <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <a
              href="https://maps.google.com/?q=Jl.+Sudirman+No.+42,+Senopati,+Jakarta+Selatan"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-cream-400/60 transition-all duration-300 hover:text-gold-400"
            >
              <MapPin className="h-4 w-4 transition-all duration-300 group-hover:drop-shadow-[0_0_4px_rgba(212,175,55,0.5)]" aria-hidden="true" />
              Jl. Sudirman No. 42, Senopati
            </a>
            <a
              href="tel:+622156789012"
              className="group flex items-center gap-2 text-sm text-cream-400/60 transition-all duration-300 hover:text-gold-400"
            >
              <Phone className="h-4 w-4 transition-all duration-300 group-hover:drop-shadow-[0_0_4px_rgba(212,175,55,0.5)]" aria-hidden="true" />
              +62 21 5678 9012
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
