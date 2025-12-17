"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Scissors, Users, TrendingUp, Receipt } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function DashboardOverview() {
  const [selectedMonth, setSelectedMonth] = useState("december")

  // Mock data for chart
  const chartData = [
    { month: "Jul", revenue: 8500, expenses: 3200, profit: 5300 },
    { month: "Aug", revenue: 9200, expenses: 3400, profit: 5800 },
    { month: "Sep", revenue: 10100, expenses: 3600, profit: 6500 },
    { month: "Oct", revenue: 11300, expenses: 3800, profit: 7500 },
    { month: "Nov", revenue: 11800, expenses: 4000, profit: 7800 },
    { month: "Dec", revenue: 12450, expenses: 4200, profit: 8250 },
  ]

  const stats = {
    totalRevenue: 12450.0,
    totalExpenses: 4200.0,
    netProfit: 8250.0,
    totalServices: 234,
    totalCustomers: 156,
    monthlyGrowth: 12.5,
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your business performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                ${stats.totalRevenue.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-destructive" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                ${stats.totalExpenses.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                ${stats.netProfit.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Revenue - Expenses</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-primary" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalServices}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalCustomers}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Unique customers</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">+{stats.monthlyGrowth}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Revenue, expenses, and profit trends over time</CardDescription>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="july">July 2025</SelectItem>
                <SelectItem value="august">August 2025</SelectItem>
                <SelectItem value="september">September 2025</SelectItem>
                <SelectItem value="october">October 2025</SelectItem>
                <SelectItem value="november">November 2025</SelectItem>
                <SelectItem value="december">December 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              expenses: {
                label: "Expenses",
                color: "hsl(var(--chart-2))",
              },
              profit: {
                label: "Profit",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px] md:h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
