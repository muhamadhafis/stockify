"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  MapPin,
  Truck,
  History,
  LogOut,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Parts", href: "/parts" },
  { icon: Boxes, label: "Stocks", href: "/stocks" },
  { icon: MapPin, label: "Locations", href: "/locations" },
  { icon: Truck, label: "Suppliers", href: "/suppliers" },
  { icon: History, label: "History", href: "/history" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-50">
      <div className="flex items-center gap-2 h-16 px-6 border-b border-sidebar-border font-serif">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold">S</span>
        </div>
        <span className="text-xl font-bold font-serif bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Stockify
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group font-sans",
              pathname === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-muted"
            )}>
              <item.icon className={cn(
                "w-5 h-5",
                pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border font-sans">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
