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

export const deleteExpense = async(id:string) => {
  try {
    await prisma.expense.delete({
      where: {
        id,
      },
    })
    revalidatePath("/budget")
  } catch (error) {
    console.error("Error deleting expense:", error)
    return { error: "Failed to delete expense" }
  }
}

export const addBook = async(formData:FormData) => {
  const session = await getServerSession(authOptions)
  const userId = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  })
  if (!userId) {
    throw new Error("User not found")
  }
  try {
    await prisma.book.create({
      data: {
        title: formData.get("bookTitle") as string,
        author: formData.get("bookAuthor") as string,
        user: {
          connect: {
            id: userId.id,
          },
        },
      },
    })
    revalidatePath("/journal")
  } catch (error) {
    console.error("Error adding book:", error)
    return { error: "Failed to add book" }
  }
}

export const addChapter = async(formData:FormData, bookId:string) => {
  try {
    await prisma.chapter.create({
      data: {
        title: formData.get("chapterTitle") as string,
        content: '',
        book: {
          connect: {
            id: bookId,
          },
        },
    }})
    revalidatePath(`/journal/${bookId}`)
  } catch (error) {
    console.error("Error adding chapter:", error)
    return { error: "Failed to add chapter" }
  }
}

export const updateChapter = async(formData:FormData, chapterId:string) => {
  const content = formData.get("content") as string
  const fixedContent = content.replace("<p></p>", "<br>")
  try {
    await prisma.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        content: fixedContent,
      },
    })
    revalidatePath(`/journal/${chapterId}`)
  } catch (error) {
    console.error("Error updating chapter:", error)
    return { error: "Failed to update chapter" }
  }
}

export const addKeyword = async(formData:FormData, chapterId:string) => {
  try {
    await prisma.keyword.create({
      data: {
        word: formData.get("keyword") as string,
        definition: formData.get("definition") as string,
        chapter: {
          connect: {
            id: chapterId,
          },
        },
    }})
    revalidatePath(`/journal/${chapterId}`)
  } catch (error) {
    console.error("Error adding keyword:", error)
    return { error: "Failed to add keyword" }
  }
}

export const deleteKeyword = async(id:string) => {
  try {
    await prisma.keyword.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("Error deleting keyword:", error)
    return { error: "Failed to delete keyword" }
  }
}