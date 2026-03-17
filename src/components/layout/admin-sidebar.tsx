"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Tag,
  Armchair,
  Map,
  Package,
  Users,
  BarChart3,
  TrendingUp,
  Settings,
  Monitor,
  X,
  Menu,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Icon mapping -- maps the string `icon` field in ADMIN_NAV_LINKS to its
// corresponding lucide-react component.
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Tag,
  Armchair,
  Map,
  Package,
  Users,
  BarChart3,
  TrendingUp,
  Settings,
  Monitor,
};

// ---------------------------------------------------------------------------
// Group definitions -- each group has a label and the ordered list of link
// labels that belong to it.
// ---------------------------------------------------------------------------
interface NavGroup {
  label: string;
  items: string[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: ["Dashboard", "POS / Cashier", "Orders", "Reservations"],
  },
  {
    label: "Management",
    items: ["Menus", "Categories", "Tables", "Table Layout", "Inventory"],
  },
  { label: "Analytics", items: ["Customers", "Reports", "Analytics"] },
  { label: "System", items: ["Settings"] },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      onToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Determine whether a link is the currently active route
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ---------- Mobile overlay backdrop ---------- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* ---------- Sidebar ---------- */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-[280px] flex-col bg-charcoal-900 transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:static md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}>
        {/* ---- Logo area ---- */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="Ruang Rumi"
              width={120}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
            <span className="rounded-md bg-coffee-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Admin
            </span>
          </Link>
          {/* Close button -- mobile only */}
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-cream-200 hover:bg-white/10 md:hidden"
            aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---- Navigation ---- */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {/* Group label */}
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-cream-200/50">
                {group.label}
              </p>

              <ul className="space-y-0.5">
                {group.items.map((itemLabel) => {
                  const link = ADMIN_NAV_LINKS.find(
                    (l) => l.label === itemLabel,
                  );
                  if (!link) return null;

                  const Icon = ICON_MAP[link.icon];
                  const active = isActive(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-coffee-500 text-white shadow-md"
                            : "text-cream-100 hover:bg-coffee-500/20 hover:text-white",
                        )}>
                        {Icon && (
                          <Icon
                            className={cn(
                              "h-[18px] w-[18px] shrink-0",
                              active ? "text-white" : "text-cream-200/70",
                            )}
                          />
                        )}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ---- Footer ---- */}
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-[11px] text-cream-200/40 text-center">
            &copy; 2026 Ruang Rumi
          </p>
        </div>
      </aside>
    </>
  );
}
