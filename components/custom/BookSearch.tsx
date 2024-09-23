"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Search } from 'lucide-react'

// Mock data - replace with actual data fetching logic
const books = [
  { id: '1', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: '2', title: '1984', author: 'George Orwell' },
  { id: '3', title: 'Pride and Prejudice', author: 'Jane Austen' },
  { id: '4', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: '5', title: 'Moby Dick', author: 'Herman Melville' },
  // Add more books as needed
]

interface Book {
  id: string,
  title: string,
  author: string,
  userId: string,
  createdAt: Date,
  updatedAt: Date
}

export default function BookJournalSearch({ data }:{  data:Book[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBooks, setFilteredBooks] = useState(data)

  useEffect(() => {
    const results = data.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBooks(results)
  }, [searchTerm])

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/70 to-primary/50 shadow-lg">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white bg-opacity-70 backdrop-blur-sm rounded-full border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          />
        </div>
        <ScrollArea className="h-[300px] rounded-md border border-primary/10 bg-white bg-opacity-50 backdrop-blur-sm p-4">
          <AnimatePresence>
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/journal/${book.id}`} passHref>
                  <motion.div
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-primary/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Book className="text-primary" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredBooks.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-4"
            >
              No books found. Try a different search term.
            </motion.p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}