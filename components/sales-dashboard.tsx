"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Scissors,
  DollarSign,
  Receipt,
  LogOut,
  Plus,
  MessageCircleWarning,
  Eye,
} from "lucide-react";
import { ServiceRecordDialog } from "./service-record-dialog";
import { ExpenseRecordDialog } from "./expense-record-dialog";
import { Decimal } from "@prisma/client/runtime/client";

interface Props {
  services: any[];
  expenses: any[];
  todaySales: number | Decimal;
  todayServices: number;
  todayExpenses: number | Decimal;
}

export function SalesDashboard({
  services,
  expenses,
  todaySales,
  todayServices,
  todayExpenses,
}: Props) {
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);


  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Sales Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  CityCut Management
                </p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 bg-background text-foreground">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">
                  ₦{Number(todaySales)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Services Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">
                  {todayServices}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-destructive" />
                <span className="text-3xl font-bold text-foreground">
                  ₦{Number(todayExpenses)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Button
            size="lg"
            className="h-auto py-6 text-base cursor-pointer"
            onClick={() => setShowServiceDialog(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Record Service
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-auto py-6 text-base bg-transparent cursor-pointer"
            onClick={() => setShowExpenseDialog(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Record Expense
          </Button>
        </div>

        {/* Recent Activity - Services and Expenses Side by Side */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Services */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Services</CardTitle>
              <CardDescription>
                Latest {services.length} service transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {services.length < 1 ? (
                <div className="space-y-4 flex flex-col items-center justify-center py-8">
                  <MessageCircleWarning className="w-10 h-10 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">
                    No recent service transactions recorded yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col gap-3 py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Scissors className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground capitalize">
                            {s.serviceType}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {s.customer.name} • {s.barberName}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-semibold text-foreground">
                              ₦{s.amountPaid}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(s.serviceDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedService(s)}
                        className="cursor-pointer w-full"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                Latest {expenses.length} expense records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expenses.length < 1 ? (
                <div className="space-y-4 flex flex-col items-center justify-center py-8">
                  <MessageCircleWarning className="w-10 h-10 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">
                    No recent expenses recorded yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expenses.map((e) => (
                    <div
                      key={e.id}
                      className="flex flex-col gap-3 py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <Receipt className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground capitalize">
                            {e.category}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {e.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-semibold text-foreground">
                              ₦{e.amount}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(e.expenseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedExpense(e)}
                        className="cursor-pointer w-full"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Service Details Dialog */}
      <Dialog
        open={!!selectedService}
        onOpenChange={() => setSelectedService(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Service Details</DialogTitle>
            <DialogDescription>
              Complete information about this service
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium text-foreground">
                    {selectedService.customer.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium text-foreground">
                    {selectedService.customer.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedService.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barber</p>
                  <p className="font-medium text-foreground">
                    {selectedService.barberName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedService.serviceDate).toLocaleDateString(
                      "en-NG",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedService.serviceDate).toLocaleTimeString(
                      "en-NG",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // Nigerians commonly use 12-hour format
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="font-semibold text-lg text-foreground">
                    ₦{selectedService.amountPaid}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedService.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Expense Details Dialog */}
      <Dialog
        open={!!selectedExpense}
        onOpenChange={() => setSelectedExpense(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>
              Complete information about this expense
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedExpense.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedExpense.expenseDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedExpense.expenseDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium text-foreground">
                  {selectedExpense.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg text-foreground">
                    ₦{selectedExpense.amount}
                  </p>
                </div>
                {selectedExpense.paymentMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedExpense.paymentMethod}
                    </p>
                  </div>
                )}
              </div>

              {selectedExpense.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium text-foreground">
                    {selectedExpense.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Record Dialogs */}
      <ServiceRecordDialog
        open={showServiceDialog}
        onOpenChange={setShowServiceDialog}
      />
      <ExpenseRecordDialog
        open={showExpenseDialog}
        onOpenChange={setShowExpenseDialog}
      />
    </div>
  );
}
