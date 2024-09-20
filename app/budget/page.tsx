"use server"
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import React from 'react';
import BudgetDisplay from '@/components/custom/BudgetDisplay';
import AddExpense from '@/components/custom/AddExpense';
import { prisma } from '@/lib/prisma';

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }

  const expenseData = await prisma.expense.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
  });
  const totalExpenses = expenseData.reduce((acc, expense) => acc + expense.amount, 0);

  const userData = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  const budgetData = {
    income: userData?.income || 0,
    expenses: totalExpenses,
    savings: (userData?.income || 0) - totalExpenses,
    expenseCategories: expenseData,
  }  

  return (
    <div className="container mx-auto p-20">
      <h1 className="text-3xl font-bold text-center mb-6">Budget Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className='py-20'>
          <AddExpense />
        </div>
        <div>
          <BudgetDisplay data={budgetData} />
        </div>
      </div>
    </div>
  );
}