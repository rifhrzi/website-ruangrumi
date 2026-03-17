"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, User, ChevronDown, Menu } from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Derive page title from the current path by matching ADMIN_NAV_LINKS
// ---------------------------------------------------------------------------
function usePageTitle(): { title: string; breadcrumbs: string[] } {
  const pathname = usePathname();

  const matched = ADMIN_NAV_LINKS.find((l) =>
    l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href),
  );

  const title = matched?.label ?? "Dashboard";

  // Simple breadcrumb: Admin > Current Page
  const breadcrumbs = ["Admin"];
  if (title !== "Dashboard") breadcrumbs.push(title);

  return { title, breadcrumbs };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { title, breadcrumbs } = usePageTitle();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-cream-200 bg-white/80 px-4 backdrop-blur-sm md:px-6">
      {/* ---------- Left side ---------- */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-charcoal-700 hover:bg-cream-100 md:hidden"
          aria-label="Toggle sidebar">
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <nav
          className="hidden items-center gap-1.5 text-sm sm:flex"
          aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-cream-300">/</span>}
              <span
                className={cn(
                  idx === breadcrumbs.length - 1
                    ? "font-semibold text-brown-800"
                    : "text-charcoal-700/60",
                )}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        {/* Mobile title */}
        <span className="text-sm font-semibold text-brown-800 sm:hidden">
          {title}
        </span>
      </div>

      {/* ---------- Center: search bar ---------- */}
      <div className="hidden max-w-md flex-1 px-8 lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-700/40" />
          <input
            type="text"
            placeholder="Search orders, customers, menus..."
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            className="w-full rounded-lg border border-cream-200 bg-cream-50 py-2 pl-10 pr-4 text-sm text-brown-800 placeholder:text-charcoal-700/40 focus:border-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-500/20"
          />
        </div>
      </div>

      {/* ---------- Right side ---------- */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          onClick={() => alert("No new notifications")}
          className="relative rounded-lg p-2 text-charcoal-700 hover:bg-cream-100"
          aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {/* Count badge */}
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="mx-1 hidden h-8 w-px bg-cream-200 sm:block" />

        {/* User dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-cream-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coffee-500 text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-brown-800 leading-tight">
                Admin
              </p>
              <p className="text-[11px] text-charcoal-700/60 leading-tight">
                admin@ruangrumi.id
              </p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-charcoal-700/60 sm:block" />
          </button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-cream-200 bg-white py-1 shadow-lg">
              <a
                href="/admin/settings"
                className="block px-4 py-2 text-sm text-brown-800 hover:bg-cream-50">
                Settings
              </a>
              <a
                href="/"
                className="block px-4 py-2 text-sm text-brown-800 hover:bg-cream-50">
                View Site
              </a>
              <div className="my-1 border-t border-cream-200" />
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
                    window.location.href = "/login";
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
