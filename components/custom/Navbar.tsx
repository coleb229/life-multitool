"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Wallet, Calendar, Clock, Wrench, Menu, X, BookOpenText } from 'lucide-react'

const navItems = [
  { icon: Wallet, label: 'Budget', href: '/budget' },
  { icon: BookOpenText, label: 'Book Journal', href: '/journal' },
  { icon: Clock, label: 'Planner', href: '/planner' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Wrench, label: 'Tools', href: '/tools' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsRendered(true)
  }, [])

  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: -50,
      scale: 0.8,
      rotateX: -60
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { 
        duration: 0.8, 
        ease: [.17,.67,.83,.67],
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20, rotateX: -45 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <motion.nav
      initial="hidden"
      animate={isRendered ? "visible" : "hidden"}
      variants={containerVariants}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
    >
      <div className="relative w-full max-w-3xl">
        <motion.div
          className="flex items-center justify-between bg-white rounded-full shadow-lg overflow-hidden"
          layout
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center justify-center flex-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <motion.div
                  variants={itemVariants}
                  className={`relative flex items-center px-4 py-2 m-1 rounded-full cursor-pointer ${
                    pathname === item.href
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon size={20} className="mr-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      className="absolute inset-0 bg-blue-100 rounded-full z-[-1]"
                      layoutId="active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl mt-2 py-2 md:hidden"
            >
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <motion.div
                    className={`flex items-center px-6 py-3 cursor-pointer ${
                      pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}