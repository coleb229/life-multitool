"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const addExpense = async(formData:FormData) => {
  try {
    const session = await getServerSession(authOptions)
    const userId = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    })
    if (!userId) {
      throw new Error("User not found")
    }
    await prisma.expense.create({
      data: {
        name: formData.get("description") as string,
        amount: parseFloat(formData.get("amount") as string),
        category: formData.get("category") as string,
        user: {
          connect: {
            id: userId.id,
          },
        },
      },
    })
    revalidatePath("/budget")
  } catch (error) {
    console.error("Error adding expense:", error)
    return { error: "Failed to add expense" }
  }
}

export const updateIncome = async(income:number) => {
  try {
    const session = await getServerSession(authOptions)
    const userId = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    })
    if (!userId) {
      throw new Error("User not found")
    }
    await prisma.user.update({
      where: {
        id: userId.id,
      },
      data: {
        income,
      },
    })
    revalidatePath("/budget")
  } catch (error) {
    console.error("Error updating income:", error)
    return { error: "Failed to update income" }
  }
}