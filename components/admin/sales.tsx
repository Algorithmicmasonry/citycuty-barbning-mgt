
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scissors, Filter, Eye, MessageCircleWarning } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, parse, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"

interface Sale {
  id: string
  customer: string
  phone: string
  service: string
  barber: string
  amount: number
  paymentMethod: string
  date: string
  time: string
  fullDate: Date
}

interface Props {
  sales: Sale[]
}

export function SalesHistory({ sales }: Props) {
  const [filterType, setFilterType] = useState<"all" | "day" | "month">("all")
  const [dateFilter, setDateFilter] = useState("")
  const [monthFilter, setMonthFilter] = useState("")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  // Filter sales based on selected filters
  const filteredSales = useMemo(() => {
    if (filterType === "all") {
      return sales
    }

    if (filterType === "day" && dateFilter) {
      return sales.filter(sale => sale.date === dateFilter)
    }

    if (filterType === "month" && monthFilter) {
      try {
        const monthDate = parse(monthFilter, 'yyyy-MM', new Date())
        const start = startOfMonth(monthDate)
        const end = endOfMonth(monthDate)
        
        return sales.filter(sale => {
          const saleDate = new Date(sale.fullDate)
          return isWithinInterval(saleDate, { start, end })
        })
      } catch (error) {
        return sales
      }
    }

    return sales
  }, [sales, filterType, dateFilter, monthFilter])

  // Calculate total for filtered sales
  const filteredTotal = filteredSales.reduce((sum, sale) => sum + sale.amount, 0)

  const handleApplyFilter = () => {
    // Filter is automatically applied via useMemo, this is just for UI feedback
    console.log('Filter applied')
  }

  const handleClearFilters = () => {
    setFilterType("all")
    setDateFilter("")
    setMonthFilter("")
  }

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="filter-type">Filter Type</Label>
                <Select value={filterType} onValueChange={(value: "all" | "day" | "month") => setFilterType(value)}>
                  <SelectTrigger id="filter-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="day">By Day</SelectItem>
                    <SelectItem value="month">By Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filterType === "day" && (
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
              )}

              {filterType === "month" && (
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

              {filterType !== "all" && (
                <div className="flex items-end gap-2">
                  <Button onClick={handleApplyFilter}>
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filter
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Filter Summary */}
            {filterType !== "all" && (
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredSales.length} transaction{filteredSales.length !== 1 ? 's' : ''}
                  {filterType === "day" && dateFilter && ` for ${format(parse(dateFilter, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')}`}
                  {filterType === "month" && monthFilter && ` for ${format(parse(monthFilter, 'yyyy-MM', new Date()), 'MMMM yyyy')}`}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Total: ₦{filteredTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Sales</CardTitle>
          <CardDescription>
            Showing {filteredSales.length} of {sales.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="space-y-4 flex flex-col items-center justify-center py-12">
              <MessageCircleWarning className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground">No transactions found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filterType !== "all" 
                    ? "Try adjusting your filters or clear them to see all transactions"
                    : "No sales have been recorded yet"}
                </p>
              </div>
              {filterType !== "all" && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Scissors className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">{sale.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.customer} • Barber: {sale.barber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-13 md:ml-0">
                    <div className="text-left md:text-right flex-1">
                      <p className="font-semibold text-foreground">₦{sale.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{sale.paymentMethod}</p>
                    </div>
                    <div className="text-left md:text-right min-w-[80px]">
                      <p className="text-sm text-foreground">{sale.date}</p>
                      <p className="text-xs text-muted-foreground">{sale.time}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedSale(sale)} className="cursor-pointer">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  <p className="font-medium text-foreground capitalize">{selectedSale.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium text-foreground">{selectedSale.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium text-foreground capitalize">{selectedSale.service}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barber</p>
                  <p className="font-medium text-foreground capitalize">{selectedSale.barber}</p>
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
                  <p className="font-semibold text-lg text-foreground">₦{selectedSale.amount.toFixed(2)}</p>
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