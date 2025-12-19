
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Receipt, Filter, Eye, MessageCircleWarning } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, parse, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  recordedBy: string
  date: string
  time: string
  fullDate: Date
}

interface Props {
  expenses: Expense[]
}

export function ExpensesHistory({ expenses }: Props) {
  const [filterType, setFilterType] = useState<"all" | "day" | "month">("all")
  const [dateFilter, setDateFilter] = useState("")
  const [monthFilter, setMonthFilter] = useState("")
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  // Filter expenses based on selected filters
  const filteredExpenses = useMemo(() => {
    if (filterType === "all") {
      return expenses
    }

    if (filterType === "day" && dateFilter) {
      return expenses.filter(expense => expense.date === dateFilter)
    }

    if (filterType === "month" && monthFilter) {
      try {
        const monthDate = parse(monthFilter, 'yyyy-MM', new Date())
        const start = startOfMonth(monthDate)
        const end = endOfMonth(monthDate)
        
        return expenses.filter(expense => {
          const expenseDate = new Date(expense.fullDate)
          return isWithinInterval(expenseDate, { start, end })
        })
      } catch (error) {
        return expenses
      }
    }

    return expenses
  }, [expenses, filterType, dateFilter, monthFilter])

  // Calculate total for filtered expenses
  const filteredTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(expenses.map(e => e.category))
    return Array.from(categorySet).sort()
  }, [expenses])

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
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Expenses History</h2>
        <p className="text-muted-foreground">Complete record of all expenses recorded in the system</p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter expenses by date or month</CardDescription>
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
                    <SelectItem value="all">All Expenses</SelectItem>
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
                  Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
                  {filterType === "day" && dateFilter && ` for ${format(parse(dateFilter, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')}`}
                  {filterType === "month" && monthFilter && ` for ${format(parse(monthFilter, 'yyyy-MM', new Date()), 'MMMM yyyy')}`}
                </p>
                <p className="text-sm font-semibold text-destructive">
                  Total: ₦{filteredTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            Showing {filteredExpenses.length} of {expenses.length} expenses recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="space-y-4 flex flex-col items-center justify-center py-12">
              <MessageCircleWarning className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground">No expenses found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filterType !== "all" 
                    ? "Try adjusting your filters or clear them to see all expenses"
                    : "No expenses have been recorded yet"}
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
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">{expense.category}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-none">
                        {expense.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-13 md:ml-0">
                    <div className="text-left md:text-right flex-1">
                      <p className="font-semibold text-destructive">₦{expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Expense</p>
                    </div>
                    <div className="text-left md:text-right min-w-[80px]">
                      <p className="text-sm text-foreground">{expense.date}</p>
                      <p className="text-xs text-muted-foreground">{expense.time}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedExpense(expense)} 
                      className="cursor-pointer"
                    >
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

      {/* Expense Details Dialog */}
      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>Complete information about this expense</DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground capitalize">{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg text-destructive">
                    ₦{selectedExpense.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium text-foreground">{selectedExpense.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{selectedExpense.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">{selectedExpense.time}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Recorded By</p>
                <p className="font-medium text-foreground">{selectedExpense.recordedBy}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}