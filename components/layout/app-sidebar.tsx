"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagsIcon,
  TicketIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/products",
    label: "Products",
    icon: PackageIcon,
  },
  {
    href: "/categories",
    label: "Categories",
    icon: TagsIcon,
    disabled: true,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCartIcon,
    disabled: true,
  },
  {
    href: "/coupons",
    label: "Coupons",
    icon: TicketIcon,
    disabled: true,
  },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/products" className="font-heading text-sm font-semibold">
          Store Admin
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const disabled = "disabled" in item && item.disabled;

          if (disabled) {
            return (
              <span
                key={item.href}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground/70"
              >
                <Icon className="size-4" />
                {item.label}
                <span className="ml-auto text-[10px] tracking-wide uppercase">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
