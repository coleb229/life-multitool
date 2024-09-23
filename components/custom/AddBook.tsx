"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Book } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { addBook } from '@/lib/db'

export default function AddBookDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async(formData:FormData) => {
    const result = await addBook(formData)
    if (result?.error) {
      toast({
        title: 'Book added successfully',
        description: 'The book has been added to your journal.',
      })
    } else {
      toast({
        title: 'An error occurred',
        description: 'There was a problem adding the book to your journal.',
      })
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-primary hover:bg-primary/40 text-black hover:text-primary border-primary/20"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[425px] bg-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className='text-primary'>Add a New Book</DialogTitle>
                <DialogDescription>
                  Enter the details of the book you'd like to add to your journal.
                </DialogDescription>
              </DialogHeader>
              <form action={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className='text-primary'>Book Title</Label>
                  <Input
                    id="title"
                    name='bookTitle'
                    placeholder="Enter book title"
                    className="border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author" className='text-primary'>Author</Label>
                  <Input
                    id="author"
                    name='bookAuthor'
                    placeholder="Enter author name"
                    className="border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  <Book className="mr-2 h-4 w-4" />
                  Add Book
                </Button>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}