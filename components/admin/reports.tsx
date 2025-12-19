"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { endOfMonth, endOfYear, format, isWithinInterval, parse, startOfMonth, startOfYear } from "date-fns"
import { Award, Calendar, DollarSign, RefreshCw, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface Service {
  id: string
  serviceType: string
  amountPaid: number
  paymentMethod: string
  serviceDate: string
  customerId: string
  customerName: string
}

interface Expense {
  id: string
  category: string
  amount: number
  expenseDate: string
  description: string
}

interface Props {
  data: {
    services: Service[]
    expenses: Expense[]
    totalCustomers: number
  }
}

type DateRange = "all" | "month" | "year" | "custom"

export function DetailedReports({ data }: Props) {
  const { services, expenses, totalCustomers } = data

  // Filter states
  const [dateRange, setDateRange] = useState<DateRange>("month")
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [selectedYear, setSelectedYear] = useState(format(new Date(), 'yyyy'))
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [chartView, setChartView] = useState<"monthly" | "yearly">("monthly")

  // Get available months and years from data
  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    services.forEach(s => months.add(format(new Date(s.serviceDate), 'yyyy-MM')))
    expenses.forEach(e => months.add(format(new Date(e.expenseDate), 'yyyy-MM')))
    return Array.from(months).sort().reverse()
  }, [services, expenses])

  const availableYears = useMemo(() => {
    const years = new Set<string>()
    services.forEach(s => years.add(format(new Date(s.serviceDate), 'yyyy')))
    expenses.forEach(e => years.add(format(new Date(e.expenseDate), 'yyyy')))
    return Array.from(years).sort().reverse()
  }, [services, expenses])

  // Filter data based on selected range
  const filteredData = useMemo(() => {
    let start: Date | null = null
    let end: Date | null = null

    if (dateRange === "month" && selectedMonth) {
      const monthDate = parse(selectedMonth, 'yyyy-MM', new Date())
      start = startOfMonth(monthDate)
      end = endOfMonth(monthDate)
    } else if (dateRange === "year" && selectedYear) {
      const yearDate = parse(selectedYear, 'yyyy', new Date())
      start = startOfYear(yearDate)
      end = endOfYear(yearDate)
    } else if (dateRange === "custom" && customStartDate && customEndDate) {
      start = new Date(customStartDate)
      end = new Date(customEndDate)
    }

    let filteredServices = services
    let filteredExpenses = expenses

    if (start && end) {
      filteredServices = services.filter(s => {
        const date = new Date(s.serviceDate)
        return isWithinInterval(date, { start, end })
      })
      filteredExpenses = expenses.filter(e => {
        const date = new Date(e.expenseDate)
        return isWithinInterval(date, { start, end })
      })
    }

    return { services: filteredServices, expenses: filteredExpenses }
  }, [services, expenses, dateRange, selectedMonth, selectedYear, customStartDate, customEndDate])

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    const { services: filteredServices, expenses: filteredExpenses } = filteredData

    const totalRevenue = filteredServices.reduce((sum, s) => sum + s.amountPaid, 0)
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    // Unique customers in period
    const uniqueCustomers = new Set(filteredServices.map(s => s.customerId)).size
    const avgCustomerValue = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      uniqueCustomers,
      avgCustomerValue,
      totalServices: filteredServices.length,
    }
  }, [filteredData])

  // Revenue by service type
  const revenueByService = useMemo(() => {
    const groups = filteredData.services.reduce((acc, s) => {
      if (!acc[s.serviceType]) {
        acc[s.serviceType] = { amount: 0, count: 0 }
      }
      acc[s.serviceType].amount += s.amountPaid
      acc[s.serviceType].count += 1
      return acc
    }, {} as Record<string, { amount: number; count: number }>)

    return Object.entries(groups)
      .map(([service, data]) => ({
        service,
        amount: Math.round(data.amount),
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [filteredData.services])

  // Payment methods distribution
  const paymentMethods = useMemo(() => {
    const groups = filteredData.services.reduce((acc, s) => {
      if (!acc[s.paymentMethod]) acc[s.paymentMethod] = 0
      acc[s.paymentMethod] += s.amountPaid
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(groups).reduce((sum, val) => sum + val, 0)
    return Object.entries(groups)
      .map(([method, amount]) => ({
        method,
        amount: Math.round(amount),
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [filteredData.services])

  // Chart data based on view
  const chartData = useMemo(() => {
    if (chartView === "yearly") {
      // Group by year
      const yearGroups = new Map<string, { revenue: number; expenses: number; customers: Set<string> }>()

      filteredData.services.forEach(s => {
        const year = format(new Date(s.serviceDate), 'yyyy')
        if (!yearGroups.has(year)) {
          yearGroups.set(year, { revenue: 0, expenses: 0, customers: new Set() })
        }
        const group = yearGroups.get(year)!
        group.revenue += s.amountPaid
        group.customers.add(s.customerId)
      })

      filteredData.expenses.forEach(e => {
        const year = format(new Date(e.expenseDate), 'yyyy')
        if (!yearGroups.has(year)) {
          yearGroups.set(year, { revenue: 0, expenses: 0, customers: new Set() })
        }
        yearGroups.get(year)!.expenses += e.amount
      })

      return Array.from(yearGroups.entries())
        .map(([year, data]) => ({
          period: year,
          revenue: Math.round(data.revenue),
          expenses: Math.round(data.expenses),
          profit: Math.round(data.revenue - data.expenses),
          customers: data.customers.size,
        }))
        .sort((a, b) => a.period.localeCompare(b.period))
    } else {
      // Group by month
      const monthGroups = new Map<string, { revenue: number; expenses: number; customers: Set<string> }>()

      filteredData.services.forEach(s => {
        const month = format(new Date(s.serviceDate), 'MMM yyyy')
        if (!monthGroups.has(month)) {
          monthGroups.set(month, { revenue: 0, expenses: 0, customers: new Set() })
        }
        const group = monthGroups.get(month)!
        group.revenue += s.amountPaid
        group.customers.add(s.customerId)
      })

      filteredData.expenses.forEach(e => {
        const month = format(new Date(e.expenseDate), 'MMM yyyy')
        if (!monthGroups.has(month)) {
          monthGroups.set(month, { revenue: 0, expenses: 0, customers: new Set() })
        }
        monthGroups.get(month)!.expenses += e.amount
      })

      return Array.from(monthGroups.entries())
        .map(([month, data]) => ({
          period: month,
          revenue: Math.round(data.revenue),
          expenses: Math.round(data.expenses),
          profit: Math.round(data.revenue - data.expenses),
          customers: data.customers.size,
        }))
        .sort((a, b) => {
          const dateA = parse(a.period, 'MMM yyyy', new Date())
          const dateB = parse(b.period, 'MMM yyyy', new Date())
          return dateA.getTime() - dateB.getTime()
        })
    }
  }, [filteredData, chartView])

  const handleReset = () => {
    setDateRange("month")
    setSelectedMonth(format(new Date(), 'yyyy-MM'))
    setSelectedYear(format(new Date(), 'yyyy'))
    setCustomStartDate("")
    setCustomEndDate("")
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Detailed Reports</h2>
          <p className="text-muted-foreground">Comprehensive analytics and business insights</p>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Date Range Filter</CardTitle>
              <CardDescription>Select the period you want to analyze</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Period Type</Label>
                <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">Specific Month</SelectItem>
                    <SelectItem value="year">Specific Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === "month" && availableMonths.length > 0 && (
                <div className="space-y-2">
                  <Label>Select Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMonths.map(month => (
                        <SelectItem key={month} value={month}>
                          {format(parse(month, 'yyyy-MM', new Date()), 'MMMM yyyy')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {dateRange === "year" && availableYears.length > 0 && (
                <div className="space-y-2">
                  <Label>Select Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {dateRange === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {dateRange === "all" && "Showing all-time data"}
                  {dateRange === "month" && `Showing data for ${format(parse(selectedMonth, 'yyyy-MM', new Date()), 'MMMM yyyy')}`}
                  {dateRange === "year" && `Showing data for ${selectedYear}`}
                  {dateRange === "custom" && customStartDate && customEndDate && 
                    `Showing data from ${format(new Date(customStartDate), 'MMM d, yyyy')} to ${format(new Date(customEndDate), 'MMM d, yyyy')}`}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredData.services.length} transactions • {metrics.uniqueCustomers} customers
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              ₦{metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalServices} services rendered
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl md:text-3xl font-bold text-destructive">
              ₦{metrics.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.expenses.length} expenses recorded
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`text-2xl md:text-3xl font-bold ${metrics.netProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
              ₦{metrics.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {metrics.profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4" />
              Avg Customer Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              ₦{metrics.avgCustomerValue.toFixed(2)}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.uniqueCustomers} unique customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Trends Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Financial Trends</CardTitle>
              <CardDescription>Revenue, expenses, and profit over time</CardDescription>
            </div>
            <Select value={chartView} onValueChange={(value: "monthly" | "yearly") => setChartView(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">By Month</SelectItem>
                <SelectItem value="yearly">By Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "var(--chart-1)" },
                expenses: { label: "Expenses", color: "var(--chart-3)" },
                profit: { label: "Profit", color: "var(--chart-2)" },
              }}
              className="h-[300px] md:h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="period" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="var(--chart-3)" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="var(--chart-2)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Growth Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Customer Engagement</CardTitle>
          <CardDescription>Unique customers served over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                customers: { label: "Customers", color: "var(--chart-1)" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="period" stroke="var(--muted-foreground)" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="customers" stroke="var(--chart-1)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Performance */}
      {revenueByService.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Revenue by Service Type</CardTitle>
            <CardDescription>Performance breakdown for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: "Revenue", color: "var(--chart-1)" },
                count: { label: "Count", color: "var(--chart-2)" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByService}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="service" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="amount" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      {paymentMethods.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
            <CardDescription>How customers paid during selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.method}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">₦{item.amount.toLocaleString()}</span>
                      <span className="text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}