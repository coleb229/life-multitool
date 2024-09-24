"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BookOpen, X, Plus } from 'lucide-react'
import { addKeyword, deleteKeyword } from '@/lib/db'
import { useToast } from '@/hooks/use-toast'
import { redirect } from 'next/navigation'
import DeleteButton from './DeleteButton'

interface Keyword {
  id: string;
  word: string;
  definition: string;
}

export default function KeywordsDrawer({ chapterId, bookId, data }: { chapterId: string, bookId: string, data: Keyword[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [keywords, setKeywords] = useState<Keyword[]>(data)
  const [newKeyword, setNewKeyword] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const { toast } = useToast()

  const handleSubmit = async(formData: FormData) => {
    const result = await addKeyword(formData, chapterId)
    if (!result?.error) {
      toast({
        title: 'Keyword added successfully',
        description: 'The keyword has been added to your chapter.',
      })
    } else {
      toast({
        title: 'An error occurred',
        description: 'There was a problem adding the keyword to your chapter.',
      })
    }
    redirect(`/journal/${bookId}/${chapterId}`)
  }

  const handleDelete = async(id: string) => {
    const result = await deleteKeyword(id)
    if (!result?.error) {
      toast({
        title: 'Keyword deleted successfully',
        description: 'The keyword has been removed from your chapter.',
      })
    } else {
      toast({
        title: 'An error occurred',
        description: 'There was a problem deleting the keyword from your chapter.',
      })
    }
    redirect(`/journal/${bookId}/${chapterId}`)
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      <motion.button
        className="fixed top-24 right-6 z-50 bg-primary text-white rounded-full p-3 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <BookOpen size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-secondary text-secondary-foreground shadow-lg z-50"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Keywords</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-secondary-foreground hover:bg-secondary-foreground/10"
                >
                  <X size={24} />
                </Button>
              </div>

              <ScrollArea className="flex-grow mb-4">
                <ul className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className='flex justify-between w-full'>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-primary/10 rounded-lg p-2 cursor-help">
                                {keyword.word}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>{keyword.definition}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <DeleteButton
                          id={keyword.id}
                          onDelete={() => handleDelete(keyword.id)}
                        />
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </ScrollArea>

              <div className="space-y-2">
                <form action={handleSubmit}>
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    name='keyword'
                    placeholder="New keyword"
                    className="bg-secondary-foreground/10 border-secondary-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Input
                    value={newDefinition}
                    onChange={(e) => setNewDefinition(e.target.value)}
                    name='definition'
                    placeholder="Keyword definition"
                    className="bg-secondary-foreground/10 border-secondary-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    type='submit'
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!newKeyword.trim() || !newDefinition.trim()}
                  >
                    <Plus size={20} className="mr-2" />
                    Add Keyword
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}