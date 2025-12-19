"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "../api/auth/[...nextauth]/route";

export enum PaymentMethod {
  CASH = "CASH",
  POS = "POS",
  TRANSFER = "TRANSFER",
  OTHER = "OTHER",
}

interface ServiceInput {
  customerName: string;
  customerPhone: string;
  barberName: string;
  serviceType: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export async function createServiceRecord(input: ServiceInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // 1️⃣ Find or create customer (NO transaction)
    let customer = await prisma.customer.findUnique({
      where: { phone: input.customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: input.customerName,
          phone: input.customerPhone,
          visits: 1,
        },
      });
    } else {
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          visits: { increment: 1 },
        },
      });
    }

    // 2️⃣ Create service record (customerId now guaranteed valid)
    await prisma.serviceRecord.create({
      data: {
        serviceType: input.serviceType,
        amountPaid: input.amount,
        paymentMethod: input.paymentMethod,
        barberName: input.barberName,
        customerId: customer.id, // ✅ valid FK
        recordedById: session.user.id,
      },
    });

    revalidatePath("/sales");

    return { success: true };
  } catch (error) {
    console.error("Error creating service record:", error);
    return {
      success: false,
      error: "Failed to record service",
    };
  }
}



interface ExpenseInput {
  category: string;
  amount: number;
  description?: string;
}

export async function createExpense(input: ExpenseInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    await prisma.expense.create({
      data: {
        category: input.category,
        amount: input.amount,
        description: input.description,
        recordedById: session.user.id,
      },
    });

    revalidatePath("/sales");

    return { success: true };
  } catch (error) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      error: "Failed to record expense",
    };
  }
}
