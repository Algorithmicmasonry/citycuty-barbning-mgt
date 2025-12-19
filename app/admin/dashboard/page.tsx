import { DashboardOverview } from '@/components/admin'
import  prisma  from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

async function getDashboardData() {
  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)
  const startOfLastMonth = startOfMonth(subMonths(now, 1))
  const endOfLastMonth = endOfMonth(subMonths(now, 1))

  // Get current month stats
  const [
    currentMonthServices,
    currentMonthExpenses,
    lastMonthServices,
    lastMonthExpenses,
    totalCustomers,
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
  ])

  // Calculate totals
  const currentRevenue = currentMonthServices.reduce(
    (sum, service) => sum + Number(service.amountPaid),
    0
  )
  const currentExpensesTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  )
  const lastMonthRevenue = lastMonthServices.reduce(
    (sum, service) => sum + Number(service.amountPaid),
    0
  )
  const lastMonthExpensesTotal = lastMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  )

  const netProfit = currentRevenue - currentExpensesTotal
  const lastMonthProfit = lastMonthRevenue - lastMonthExpensesTotal

  // Calculate growth rate
  const growthRate =
    lastMonthRevenue > 0
      ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0

  // Get chart data for last 6 months
  const chartData = []
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i)
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)

    const [monthServices, monthExpenses] = await Promise.all([
      prisma.serviceRecord.findMany({
        where: {
          serviceDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: {
          amountPaid: true,
        },
      }),
      prisma.expense.findMany({
        where: {
          expenseDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: {
          amount: true,
        },
      }),
    ])

    const revenue = monthServices.reduce(
      (sum, service) => sum + Number(service.amountPaid),
      0
    )
    const expenses = monthExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    )

    chartData.push({
      month: format(monthDate, 'MMM'),
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      profit: Math.round(revenue - expenses),
    })
  }

  return {
    stats: {
      totalRevenue: currentRevenue,
      totalExpenses: currentExpensesTotal,
      netProfit: netProfit,
      totalServices: currentMonthServices.length,
      totalCustomers: totalCustomers,
      monthlyGrowth: growthRate,
    },
    chartData,
  }
}

const DashboardPage = async () => {
  const data = await getDashboardData()
  
  return <DashboardOverview initialData={data} />
}

export default DashboardPage
