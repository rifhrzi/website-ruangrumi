import Link from "next/link";
import { ArrowRight, Clock3, Coffee, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
  { value: "50+", label: "Curated menu items", icon: Coffee },
  { value: "4.9", label: "Average guest rating", icon: Star },
  { value: "10K+", label: "Happy guests served", icon: Sparkles },
];

const moments = [
  {
    title: "House Signature",
    value: "Latte, pastry, and a slower pace",
  },
  {
    title: "Open Daily",
    value: "08.00 - 23.00",
  },
  {
    title: "Best For",
    value: "Quiet mornings, casual meetings, and weekend hangouts",
  },
];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-brown-900"
      aria-label="Hero">
      <div className="absolute inset-0 gradient-coffee" aria-hidden="true" />

      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(212,175,55,0.18) 0%, transparent 32%), radial-gradient(circle at 82% 18%, rgba(250,247,244,0.08) 0%, transparent 26%), radial-gradient(circle at 70% 75%, rgba(201,169,110,0.14) 0%, transparent 32%)",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-16">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-cream-100/90 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-gold-400" aria-hidden="true" />
              <span>Premium Cafe Experience</span>
            </div>

            <h1 className="mx-auto mt-6 max-w-[11ch] text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-cream-50 sm:text-6xl lg:mx-0 lg:text-7xl xl:text-[5.5rem]">
              Where Every Sip
              <span className="mt-2 block text-gold-400">Tells a Story</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-cream-100/78 sm:text-lg lg:mx-0">
              Handcrafted coffee, warm interiors, and a menu built for slow
              mornings, easy conversations, and evenings that stay a little
              longer.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Link
                href="/menu"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold",
                  "bg-gold-400 text-brown-900 shadow-lg shadow-gold-500/20 transition-all duration-300",
                  "hover:bg-gold-500 hover:shadow-xl hover:shadow-gold-500/30",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900",
                )}>
                Explore Menu
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/reservation"
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold",
                  "border border-white/15 bg-white/6 text-cream-50 backdrop-blur-md transition-all duration-300",
                  "hover:border-gold-400/40 hover:bg-white/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-100 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900",
                )}>
                Reserve a Table
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-md">
                    <Icon
                      className="mx-auto h-4 w-4 text-gold-400 lg:mx-0"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-cream-50">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-cream-100/68">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 scale-105 rounded-[2rem] bg-gold-500/12 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/7 p-5 backdrop-blur-xl sm:p-6">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(140deg, rgba(255,255,255,0.14) 0%, transparent 34%, rgba(212,175,55,0.12) 100%)",
                }}
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-brown-900/35 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cream-100/55">
                    Ruang Rumi
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-cream-50 sm:text-3xl">
                    A space built for comfort and conversation
                  </h2>
                </div>
                <div className="rounded-full border border-gold-400/20 bg-gold-400/12 p-3">
                  <Coffee className="h-5 w-5 text-gold-400" aria-hidden="true" />
                </div>
              </div>

              <div className="relative mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cream-100/55">
                    Signature Mood
                  </p>
                  <p className="mt-3 text-lg font-medium leading-8 text-cream-50">
                    Soft lighting, warm wood tones, and tables that invite you
                    to stay.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-brown-900/35 p-5">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    <p className="text-xs uppercase tracking-[0.24em] text-cream-100/55">
                      Today
                    </p>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-cream-50">
                    08.00 - 23.00
                  </p>
                  <p className="mt-2 text-sm leading-6 text-cream-100/68">
                    Coffee bar, dine-in service, and table reservations.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5 sm:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {moments.map((item) => (
                      <div key={item.title}>
                        <p className="text-xs uppercase tracking-[0.24em] text-cream-100/55">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-cream-50/88">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-12 h-16 bg-gradient-to-b from-transparent via-cream-50/10 to-cream-50/35"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-16 bg-cream-50 [clip-path:ellipse(78%_100%_at_50%_100%)]"
        aria-hidden="true"
      />
    </section>
  );
}
