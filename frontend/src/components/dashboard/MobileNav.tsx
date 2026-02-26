"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Package, Boxes, MapPin, Truck, History, LogOut, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Parts", href: "/parts" },
  { icon: Boxes, label: "Stocks", href: "/stocks" },
  { icon: MapPin, label: "Locations", href: "/locations" },
  { icon: FolderOpen, label: "Batches", href: "/batches" },
  { icon: Truck, label: "Suppliers", href: "/suppliers" },
  { icon: History, label: "History", href: "/history" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden flex flex-col font-sans">
      <header className="h-16 flex items-center justify-between px-4 bg-background border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold font-serif">S</span>
          </div>
          <span className="text-lg font-bold font-serif">Stockify</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-background animate-in slide-in-from-top duration-300">
          <nav className="p-4 space-y-2">
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span className={cn(
                  "flex items-center gap-4 p-4 rounded-xl text-base font-semibold transition-all",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground active:bg-muted"
                )}>
                  <item.icon className={cn(
                    "w-6 h-6",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )} />
                  {item.label}
                </span>
              </Link>
            ))}
            <div className="pt-8 px-4 border-t border-border mt-8">
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 p-4 h-auto text-base font-semibold text-muted-foreground active:text-destructive active:bg-destructive/5"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                <LogOut className="w-6 h-6" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
