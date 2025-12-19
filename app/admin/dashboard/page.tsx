// app/dashboard/page.tsx (Server Component)
import { DashboardOverview } from "@/components/admin";
import prisma from "@/lib/prisma";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  eachDayOfInterval,
} from "date-fns";

async function getDashboardData() {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));
  const endOfLastMonth = endOfMonth(subMonths(now, 1));

  // Get current month stats
  const [
    currentMonthServices,
    currentMonthExpenses,
    lastMonthServices,
    lastMonthExpenses,
    totalCustomers,
    allServices,
    allExpenses,
  ] = await Promise.all([
    // Current month services
    prisma.serviceRecord.findMany({
      where: {
        serviceDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      select: {
        amountPaid: true,
      },
    }),
    // Current month expenses
    prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      select: {
        amount: true,
      },
    }),
    // Last month services
    prisma.serviceRecord.findMany({
      where: {
        serviceDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      select: {
        amountPaid: true,
      },
    }),
    // Last month expenses
    prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      select: {
        amount: true,
      },
    }),
    // Total unique customers
    prisma.customer.count(),
    // All services for chart
    prisma.serviceRecord.findMany({
      select: {
        serviceDate: true,
        amountPaid: true,
      },
      orderBy: {
        serviceDate: "asc",
      },
    }),
    // All expenses for chart
    prisma.expense.findMany({
      select: {
        expenseDate: true,
        amount: true,
      },
      orderBy: {
        expenseDate: "asc",
      },
    }),
  ]);

  // Calculate totals
  const currentRevenue = currentMonthServices.reduce(
    (sum, service) => sum + Number(service.amountPaid),
    0
  );
  const currentExpensesTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  const lastMonthRevenue = lastMonthServices.reduce(
    (sum, service) => sum + Number(service.amountPaid),
    0
  );

  const netProfit = currentRevenue - currentExpensesTotal;

  // Calculate growth rate
  const growthRate =
    lastMonthRevenue > 0
      ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

  // Get available months from services and expenses
  const availableMonths = new Set<string>();
  allServices.forEach((s) => {
    availableMonths.add(format(new Date(s.serviceDate), "yyyy-MM"));
  });
  allExpenses.forEach((e) => {
    availableMonths.add(format(new Date(e.expenseDate), "yyyy-MM"));
  });

  // Generate chart data for current month (daily breakdown)
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  });

  const chartData = daysInMonth.map((day) => {
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
    const expenses = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      date: dayStr,
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      profit: Math.round(revenue - expenses),
    };
  });

  return {
    stats: {
      totalRevenue: Number(currentRevenue),
      totalExpenses: Number(currentExpensesTotal),
      netProfit: Number(netProfit),
      totalServices: Number(currentMonthServices.length),
      totalCustomers: totalCustomers,
      monthlyGrowth: Number(growthRate),
    },
    chartData,
    availableMonths: Array.from(availableMonths).sort().reverse(),
    currentMonth: format(now, "yyyy-MM"),
    allServices,
    allExpenses,
  };
}

const DashboardPage = async () => {
  const data = await getDashboardData();

  return <DashboardOverview initialData={data} />;
};

export default DashboardPage;
