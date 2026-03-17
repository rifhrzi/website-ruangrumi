'use client';

import Link from 'next/link';
import Logo from '@/components/ui/logo';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Send,
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const OPERATING_HOURS = [
  { days: 'Monday - Friday', hours: '08:00 - 22:00' },
  { days: 'Saturday - Sunday', hours: '09:00 - 23:00' },
];

const CONTACT_INFO = {
  address: 'Jl. Sudirman No. 42, Senopati, Jakarta Selatan 12190',
  phone: '+62 21 5678 9012',
  email: 'hello@ruangrumi.id',
};

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/ruangrumi',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/ruangrumi',
    icon: Facebook,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/ruangrumi',
    icon: Twitter,
  },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-cream-100 font-semibold text-sm uppercase tracking-wider mb-5">
      {children}
    </h3>
  );
}

export default function CustomerFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-brown-900 text-cream-300"
      role="contentinfo"
    >
      {/* Gold shimmer top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" aria-hidden="true" />

      {/* Newsletter banner */}
      <div className="relative border-b border-brown-700/30 overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 60%)' }} aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-cream-50">
                Stay in the Loop
              </h3>
              <p className="mt-1 text-sm text-cream-400">
                Get exclusive offers, new menu alerts, and event invitations straight to your inbox.
              </p>
            </div>
            <form
              className="flex w-full max-w-sm items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className={cn(
                  'flex-1 rounded-full bg-brown-800 px-5 py-2.5 text-sm text-cream-100',
                  'placeholder:text-cream-400/50 border border-brown-700/50',
                  'transition-colors duration-200',
                  'focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20'
                )}
              />
              <button
                type="submit"
                className={cn(
                  'inline-flex items-center justify-center rounded-full',
                  'bg-gradient-to-r from-gold-500 to-gold-400 px-5 py-2.5',
                  'text-sm font-semibold text-brown-900',
                  'transition-all duration-200',
                  'hover:shadow-lg hover:shadow-gold-500/20 hover:scale-[1.02]',
                  'active:scale-[0.98]'
                )}
              >
                <Send className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand / About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group mb-4 decoration-transparent"
              aria-label={`${APP_NAME} - Back to home`}
            >
              <Logo variant="light" size="lg" />
            </Link>
            <p className="text-sm italic text-gold-500 mb-4">{APP_TAGLINE}</p>
            <p className="text-sm leading-relaxed text-cream-400 max-w-xs">
              A premium cafe experience crafted for those who appreciate the art
              of coffee. From hand-selected beans to artisan brewing, every
              detail is curated with care.
            </p>

            {/* Social Media Icons */}
            <div className="mt-6 flex items-center gap-2.5" role="list" aria-label="Social media links">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-label={`Follow us on ${social.label}`}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      'bg-brown-800 text-cream-300 border border-brown-700/50',
                      'transition-all duration-300',
                      'hover:bg-coffee-500/20 hover:text-gold-400 hover:scale-110 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/10',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-sm text-cream-300 transition-colors duration-200',
                        'hover:text-gold-500 focus-visible:text-gold-500',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900',
                        'rounded-sm inline-block'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Operating Hours */}
          <div>
            <FooterHeading>Hours</FooterHeading>
            <ul className="space-y-3">
              {OPERATING_HOURS.map((schedule) => (
                <li key={schedule.days} className="text-sm">
                  <span className="block text-cream-200 font-medium">
                    {schedule.days}
                  </span>
                  <span className="text-cream-400">{schedule.hours}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 rounded-lg bg-coffee-500/10 px-3 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="text-xs text-cream-200">Open Now</span>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <ul className="space-y-4">
              <li>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-start gap-3 text-sm transition-colors duration-200',
                    'hover:text-gold-500 group'
                  )}
                  aria-label={`Our address: ${CONTACT_INFO.address}`}
                >
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-coffee-500 group-hover:text-gold-500 transition-colors"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{CONTACT_INFO.address}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'flex items-center gap-3 text-sm transition-colors duration-200',
                    'hover:text-gold-500 group'
                  )}
                  aria-label={`Call us at ${CONTACT_INFO.phone}`}
                >
                  <Phone
                    className="h-4 w-4 shrink-0 text-coffee-500 group-hover:text-gold-500 transition-colors"
                    aria-hidden="true"
                  />
                  <span>{CONTACT_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className={cn(
                    'flex items-center gap-3 text-sm transition-colors duration-200',
                    'hover:text-gold-500 group'
                  )}
                  aria-label={`Email us at ${CONTACT_INFO.email}`}
                >
                  <Mail
                    className="h-4 w-4 shrink-0 text-coffee-500 group-hover:text-gold-500 transition-colors"
                    aria-hidden="true"
                  />
                  <span>{CONTACT_INFO.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider with shimmer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-xs text-cream-400/60 text-center">
          &copy; {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
