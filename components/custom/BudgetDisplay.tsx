"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpIcon, ArrowDownIcon, PiggyBankIcon } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface BudgetDisplayProps {
  data: {
    income: number
    expenses: number
    savings: number
    expenseCategories: {
      name: string
      amount: number
    }[]
  }
}

export default function BudgetDisplay({ data }:BudgetDisplayProps) {
  const [budget] = useState(data)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const chartData = {
    labels: budget.expenseCategories.map((category: { name: string }) => category.name),
    datasets: [
      {
        data: budget.expenseCategories.map((category: { amount: number }) => category.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  const categories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Other']

  return (
    <motion.div
      className="container mx-auto p-4 space-y-6"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.h1 className="text-3xl font-bold text-center mb-6" variants={itemVariants}>
        Your Budget Overview
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${budget.income.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${budget.expenses.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <PiggyBankIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${budget.savings.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Your spending vs. income</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Progress value={(budget.expenses / budget.income) * 100} className="h-4" />
            </motion.div>
            <div className="mt-2 text-sm text-gray-600">
              You{"'"}ve spent {((budget.expenses / budget.income) * 100).toFixed(1)}% of your income
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full h-64"
            >
              <Doughnut data={chartData} options={chartOptions} />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Detailed breakdown of your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <>
                  <motion.li
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex justify-between items-center font-semibold"
                  >
                    <span>{category}</span>
                    <span className="font-semibold">${budget.expenseCategories.find((cat: { name: string }) => cat.name === category)?.amount.toLocaleString() || 0}</span>
                  </motion.li>
                  {budget.expenseCategories.map((expense:any, index:number) => (
                    expense.category === category.toLowerCase() && (
                      <motion.li
                        key={expense.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex justify-between items-center ml-10"
                      >
                        <span>{expense.name}</span>
                        <span className="font-semibold">${expense.amount.toLocaleString()}</span>
                      </motion.li>
                    )
                  ))}
                </>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}