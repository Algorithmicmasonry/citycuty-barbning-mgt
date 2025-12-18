"use client";

import type React from "react";

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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/sales", label: "Sales", icon: DollarSign },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/reports", label: "Reports", icon: FileText },
    { href: "/admin/expenses", label: "Expenses", icon: BanknoteArrowDown },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-r border-border bg-card md:min-h-screen">
        <div className="sticky top-0">
          {/* Logo */}
          <div className="p-4 md:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  CityCut Admin
                </h1>
                <p className="text-xs text-muted-foreground">
                  Management Portal
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2 md:p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start cursor-pointer",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-2 md:p-4 border-t border-border">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/login">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
