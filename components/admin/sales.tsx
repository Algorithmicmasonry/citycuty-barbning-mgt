"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scissors, Filter, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock sale data
const mockSales = [
  {
    id: 1,
    customer: "John Smith",
    phone: "5551234567",
    service: "Haircut & Beard Trim",
    barber: "Mike Johnson",
    amount: 45.0,
    paymentMethod: "Cash",
    date: "2025-12-17",
    time: "10:30 AM",
  },
  {
    id: 2,
    customer: "David Lee",
    phone: "5552345678",
    service: "Haircut",
    barber: "Sarah Williams",
    amount: 30.0,
    paymentMethod: "Card",
    date: "2025-12-17",
    time: "11:15 AM",
  },
  {
    id: 3,
    customer: "Michael Brown",
    phone: "5553456789",
    service: "Hot Shave",
    barber: "Mike Johnson",
    amount: 35.0,
    paymentMethod: "Mobile Payment",
    date: "2025-12-17",
    time: "2:00 PM",
  },
  // Add more mock data
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 4,
    customer: `Customer ${i + 4}`,
    phone: `555${Math.floor(Math.random() * 9000000 + 1000000)}`,
    service: ["Haircut", "Beard Trim", "Haircut & Beard", "Hot Shave"][Math.floor(Math.random() * 4)],
    barber: ["Mike Johnson", "Sarah Williams", "Tom Davis"][Math.floor(Math.random() * 3)],
    amount: [25, 30, 35, 40, 45, 50][Math.floor(Math.random() * 6)],
    paymentMethod: ["Cash", "Card", "Mobile Payment"][Math.floor(Math.random() * 3)],
    date: "2025-12-16",
    time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60)} ${Math.random() > 0.5 ? "AM" : "PM"}`,
  })),
]

export function SalesHistory() {
  const [filterType, setFilterType] = useState<"day" | "month">("day")
  const [dateFilter, setDateFilter] = useState("")
  const [monthFilter, setMonthFilter] = useState("")
  const [selectedSale, setSelectedSale] = useState<(typeof mockSales)[0] | null>(null)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Sales History</h2>
        <p className="text-muted-foreground">Complete record of all services and transactions</p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter sales by date or month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="filter-type">Filter Type</Label>
              <Select value={filterType} onValueChange={(value: "day" | "month") => setFilterType(value)}>
                <SelectTrigger id="filter-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">By Day</SelectItem>
                  <SelectItem value="month">By Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === "day" ? (
              <div className="flex-1 space-y-2">
                <Label htmlFor="date-filter">Select Date</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-secondary"
                />
              </div>
            ) : (
              <div className="flex-1 space-y-2">
                <Label htmlFor="month-filter">Select Month</Label>
                <Input
                  id="month-filter"
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="bg-secondary"
                />
              </div>
            )}

            <div className="flex items-end">
              <Button>
                <Filter className="w-4 h-4 mr-2" />
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Sales</CardTitle>
          <CardDescription>Showing {mockSales.length} transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSales.map((sale) => (
              <div
                key={sale.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{sale.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.customer} • Barber: {sale.barber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-13 md:ml-0">
                  <div className="text-left md:text-right flex-1">
                    <p className="font-semibold text-foreground">${sale.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{sale.paymentMethod}</p>
                  </div>
                  <div className="text-left md:text-right min-w-[80px]">
                    <p className="text-sm text-foreground">{sale.date}</p>
                    <p className="text-xs text-muted-foreground">{sale.time}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedSale(sale)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sale Details Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium text-foreground">{selectedSale.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium text-foreground">{selectedSale.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium text-foreground">{selectedSale.service}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barber</p>
                  <p className="font-medium text-foreground">{selectedSale.barber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{selectedSale.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">{selectedSale.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="font-semibold text-lg text-foreground">${selectedSale.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium text-foreground">{selectedSale.paymentMethod}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
