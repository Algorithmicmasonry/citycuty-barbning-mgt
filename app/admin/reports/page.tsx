// app/admin/reports/page.tsx (Server Component)
import { DetailedReports } from "@/components/admin"
import  prisma  from "@/lib/prisma"

export const dynamic = "force-dynamic";


async function getReportsData() {
  // Fetch ALL services and expenses - let the client filter
  const [allServices, allExpenses, totalCustomers] = await Promise.all([
    prisma.serviceRecord.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        serviceDate: 'asc',
      },
    }),
    prisma.expense.findMany({
      orderBy: {
        expenseDate: 'asc',
      },
    }),
    prisma.customer.count(),
  ])

  // Transform data
  const services = allServices.map(s => ({
    id: s.id,
    serviceType: s.serviceType,
    amountPaid: Number(s.amountPaid),
    paymentMethod: s.paymentMethod,
    serviceDate: s.serviceDate.toISOString(),
    customerId: s.customerId,
    customerName: s.customer.name,
  }))

  const expenses = allExpenses.map(e => ({
    id: e.id,
    category: e.category,
    amount: Number(e.amount),
    expenseDate: e.expenseDate.toISOString(),
    description: e.description || '',
  }))

  return {
    services,
    expenses,
    totalCustomers,
  }
}

const ReportsPage = async () => {
  const data = await getReportsData()
  
  return <DetailedReports data={data} />
}

export default ReportsPage