"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface DeleteButtonProps {
  id: string
  onDelete: any
}

export default function DeleteButton({ onDelete, id }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await onDelete(id)
    if (!result?.error) {
      toast({
        title: 'Data deleted successfully',
        description: 'The data has been deleted.',
      })
    } else {
      toast({
        title: 'An error occurred',
        description: 'There was a problem deleting the data.',
      })
    }
    setIsDeleting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete data</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className='text-primary'>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this data? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" className='text-slate-400' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <AnimatePresence mode="wait">
              {isDeleting ? (
                <motion.div
                  key="deleting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                  />
                  Deleting...
                </motion.div>
              ) : (
                <motion.span
                  key="delete"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Delete
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}