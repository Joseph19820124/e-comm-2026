"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account", label: "个人中心", icon: User, exact: true },
  { href: "/account/orders", label: "我的订单", icon: Package },
  { href: "/account/addresses", label: "收货地址", icon: MapPin },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
