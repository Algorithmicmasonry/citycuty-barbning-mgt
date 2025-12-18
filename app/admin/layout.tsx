"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Scissors,
  LogOut,
  LayoutDashboard,
  DollarSign,
  Users,
  FileText,
  BanknoteArrowDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/sales", label: "Sales", icon: DollarSign },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/reports", label: "Reports", icon: FileText },
    { href: "/admin/expenses", label: "Expenses", icon: BanknoteArrowDown },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static z-50 inset-y-0 left-0 w-64 bg-card border-r border-border",
          "transform transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
            </Link>

            <div>
              <h1 className="text-lg font-bold">CityCut Admin</h1>
              <p className="text-xs text-muted-foreground">Management Portal</p>
            </div>
          </div>

          {/* Close button (mobile) */}
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-border">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/login">
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden p-4 border-b border-border flex items-center">
          <button onClick={() => setOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
