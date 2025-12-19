// app/admin/expenses/page.tsx (Server Component)
import { ExpensesHistory } from "@/components/admin";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

async function getExpensesData() {
  const expenses = await prisma.expense.findMany({
    include: {
      recordedBy: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      expenseDate: "desc",
    },
  });

  // Transform the data to match the component's expected format
  const expensesData = expenses.map((expense) => ({
    id: expense.id,
    category: expense.category,
    amount: Number(expense.amount),
    description: expense.description || "No description",
    recordedBy: expense.recordedBy.email,
    date: format(new Date(expense.expenseDate), "yyyy-MM-dd"),
    time: format(new Date(expense.expenseDate), "h:mm a"),
    fullDate: expense.expenseDate,
  }));

  return expensesData;
}

const AdminExpensesPage = async () => {
  const expensesData = await getExpensesData();

  return <ExpensesHistory expenses={expensesData} />;
};

export default AdminExpensesPage;
