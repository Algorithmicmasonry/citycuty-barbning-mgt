"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Scissors, Users, TrendingUp, Receipt } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  parse,
} from "date-fns";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalServices: number;
    totalCustomers: number;
    monthlyGrowth: number;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  availableMonths: string[];
  currentMonth: string;
  allServices: Array<{
    serviceDate: Date;
    amountPaid: any;
  }>;
  allExpenses: Array<{
    expenseDate: Date;
    amount: any;
  }>;
}

interface Props {
  initialData: DashboardData;
}

export function DashboardOverview({ initialData }: Props) {
  const { stats, availableMonths, currentMonth, allServices, allExpenses } =
    initialData;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Generate chart data based on selected month
  const chartData = useMemo(() => {
    const monthDate = parse(selectedMonth, "yyyy-MM", new Date());
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    const daysInMonth = eachDayOfInterval({ start, end });

    return daysInMonth.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");

      const dayServices = allServices.filter(
        (s) => format(new Date(s.serviceDate), "yyyy-MM-dd") === dayStr
      );
      const dayExpenses = allExpenses.filter(
        (e) => format(new Date(e.expenseDate), "yyyy-MM-dd") === dayStr
      );

      const revenue = dayServices.reduce(
        (sum, s) => sum + Number(s.amountPaid),
        0
      );
      const expenses = dayExpenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );

      return {
        date: dayStr,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        profit: Math.round(revenue - expenses),
      };
    });
  }, [selectedMonth, allServices, allExpenses]);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-3))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Monitor your business performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                ₦
                {stats.totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-destructive" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                ₦
                {stats.totalExpenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                ₦
                {stats.netProfit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Revenue - Expenses
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services Rendered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-primary" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                {stats.totalServices}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                {stats.totalCustomers}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unique customers
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span
                className={`text-2xl md:text-3xl font-bold ${
                  stats.monthlyGrowth >= 0 ? "text-accent" : "text-destructive"
                }`}
              >
                {stats.monthlyGrowth >= 0 ? "+" : ""}
                {stats.monthlyGrowth.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Daily revenue, expenses, and profit for{" "}
              {format(parse(selectedMonth, "yyyy-MM", new Date()), "MMMM yyyy")}
            </CardDescription>
          </div>
          {availableMonths.length > 0 && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger
                className="w-[180px] rounded-lg sm:ml-auto"
                aria-label="Select month"
              >
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month} className="rounded-lg">
                    {format(parse(month, "yyyy-MM", new Date()), "MMMM yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] md:h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  stroke="hsl(243 96.9% 49.2%)"
                  fill="hsl(243 96.9% 49.2%)"
                />
                <Area
                  dataKey="expenses"
                  stroke="hsl(360 92.2% 46.7%))"
                  fill="hsl(360 92.2% 46.7%)"
                />
                <Area
                  dataKey="profit"
                  stroke="hsl(116 78.2% 52.9%)"
                  fill="hsl(116 78.2% 52.9%)"
                />

                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
