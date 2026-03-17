"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";

export default function CustomerNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useCartStore((state) => state.toggleCart);

  const isHomePage = pathname === "/";

  // ---------- scroll shadow ----------
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ---------- lock body scroll when drawer is open ----------
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ---------- close drawer on route change ----------
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // On homepage before scroll: transparent navbar with light text
  const isTransparent = isHomePage && !scrolled;

  return (
    <>
      {/* ==================== NAVBAR ==================== */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent"
            : "bg-cream-50/90 backdrop-blur-xl shadow-md shadow-brown-900/5",
        )}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ---------- Logo ---------- */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            aria-label="Ruang Rumi home">
            <Logo variant={isTransparent ? "light" : "dark"} size="md" />
          </Link>

          {/* ---------- Desktop links ---------- */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                      isTransparent
                        ? isActive
                          ? "text-gold-400"
                          : "text-cream-100 hover:text-gold-400"
                        : isActive
                          ? "text-coffee-500"
                          : "text-brown-900 hover:text-coffee-500",
                    )}>
                    {link.label}
                    {/* Active underline */}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full transition-transform duration-300 origin-left",
                        isTransparent ? "bg-gold-400" : "bg-coffee-500",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ---------- Right actions ---------- */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <button
              type="button"
              onClick={toggleCart}
              className={cn(
                "relative inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200",
                isTransparent
                  ? "text-cream-100 hover:bg-white/10 hover:text-gold-400"
                  : "text-brown-900 hover:bg-cream-200 hover:text-coffee-500",
              )}
              aria-label={`Shopping cart, ${itemCount} items`}>
              <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coffee-500 px-1 text-[10px] font-semibold leading-none text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Login button (desktop) */}
            <Link
              href="/login"
              className={cn(
                "hidden items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 md:inline-flex",
                isTransparent
                  ? "border border-cream-200/30 text-cream-100 hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-400"
                  : "border border-coffee-300 text-brown-900 hover:border-coffee-500 hover:bg-coffee-500 hover:text-white",
              )}>
              <User className="h-4 w-4" strokeWidth={1.8} />
              Login
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200 md:hidden",
                isTransparent
                  ? "text-cream-100 hover:bg-white/10 hover:text-gold-400"
                  : "text-brown-900 hover:bg-cream-200 hover:text-coffee-500",
              )}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer">
              <Menu className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </nav>
      </header>

      {/* ==================== MOBILE DRAWER ==================== */}

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer panel */}
      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-cream-50 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}>
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
            aria-label="Ruang Rumi home">
            <Logo variant="dark" size="sm" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-full p-1.5 text-brown-900 transition-colors duration-200 hover:bg-cream-200 hover:text-coffee-500"
            aria-label="Close navigation menu">
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-coffee-500/10 text-coffee-500"
                        : "text-brown-900 hover:bg-cream-200 hover:text-coffee-500",
                    )}>
                    {link.label}
                    {isActive && (
                      <span
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-coffee-500"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-cream-300 px-4 py-4">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-coffee-500 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brown-700">
            <User className="h-4 w-4" strokeWidth={1.8} />
            Login
          </Link>
        </div>
      </aside>

      {/* Spacer so page content is not hidden behind the fixed navbar.
          On home page the hero is full-viewport, so no spacer needed. */}
      {!isHomePage && <div className="h-16" aria-hidden="true" />}
    </>
  );
}
