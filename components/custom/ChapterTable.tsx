"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from 'lucide-react'
import { addChapter } from '@/lib/db'
import { redirect } from 'next/navigation'

interface Chapter {
  id: string,
  title: string,
}

export default function ChapterList({ data, bookId }:{  data:Chapter[], bookId:string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData:FormData) {
    console.log(formData)
    const result = await addChapter(formData, bookId)
    if(!result?.error) {
      toast({
        title: 'Chapter added successfully',
        description: 'The chapter has been added to your book.',
      })
    } else {
      toast({
        title: 'An error occurred',
        description: 'There was a problem adding the chapter to your book.',
      })
    }
    setIsDialogOpen(false)
    redirect(`/journal/${bookId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chapter ID</TableHead>
            <TableHead className='text-right'>Chapter Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {data.map((chapter) => (
              <motion.tr
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <TableCell className="text-left">
                  {chapter.id}
                </TableCell>
                <TableCell className='text-right'>
                  <Link href={`/journal/${bookId}/${chapter.id}`} className="text-primary hover:underline w-full">
                    {chapter.title}
                  </Link>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Chapter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
            <DialogDescription>
              Enter the details of the new chapter you want to add to your book.
            </DialogDescription>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4">
            <Input placeholder="Enter chapter title" className="border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30" name='chapterTitle' />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
              Add Chapter
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}