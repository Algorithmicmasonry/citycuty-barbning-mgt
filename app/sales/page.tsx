// app/sales/page.tsx (Server Component)
import { SalesDashboard } from "@/components/sales-dashboard";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route"; 

// Helper to serialize Prisma objects (convert Decimals to numbers)
function serializePrisma(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export default async function SalesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SALES_REP") {
    return <p>Access denied</p>;
  }

  const userId = session.user.id;

  // Fetch data for this sales rep
  const services = await prisma.serviceRecord.findMany({
    where: { recordedById: userId },
    orderBy: { serviceDate: "desc" },
    take: 5,
    include: { customer: true },
  });

  const expenses = await prisma.expense.findMany({
    where: { recordedById: userId },
    orderBy: { expenseDate: "desc" },
    take: 5,
  });

  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  const todaySales = await prisma.serviceRecord.aggregate({
    _sum: { amountPaid: true },
    where: {
      recordedById: userId,
      serviceDate: { gte: todayStart, lte: todayEnd },
    },
  });

  const todayServices = await prisma.serviceRecord.count({
    where: {
      recordedById: userId,
      serviceDate: { gte: todayStart, lte: todayEnd },
    },
  });

  const todayExpenses = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      recordedById: userId,
      expenseDate: { gte: todayStart, lte: todayEnd },
    },
  });

  console.log(todaySales._sum.amountPaid?.toNumber(), todayServices, todayExpenses._sum.amount?.toNumber())

  return (
    <SalesDashboard
      services={serializePrisma(services)}          // ✅ convert Decimals
      expenses={serializePrisma(expenses)}          // ✅ convert Decimals
      todaySales={todaySales._sum.amountPaid?.toNumber() || 0}  // ✅ convert Decimal
      todayServices={todayServices}
      todayExpenses={todayExpenses._sum.amount?.toNumber() || 0} // ✅ convert Decimal
    />
  );
}
