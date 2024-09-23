"use client"
import './styles.scss'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Menu, X } from 'lucide-react'
import { useEditor, EditorContent, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { redirect } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { updateChapter } from '@/lib/db'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

export default function UpdateChapterContent({ chapterId, data }: { chapterId: string, data: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState(data.content)
  const toggleDrawer = () => setIsOpen(!isOpen)
  const { toast } = useToast()
  const bookId = data.bookId

  const handleSubmit = async(formData:FormData) => {
    console.log(formData)
    const result = await updateChapter(formData, chapterId)
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
    setIsOpen(false)
    redirect(`/journal/${bookId}/${chapterId}`)
  }
  console.log(data.content)

  return (
    <div className="">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
          >
            <div className="flex h-full flex-col p-6 bg-black">
              <button
                onClick={toggleDrawer}
                className="self-end rounded-full bg-gray-200 p-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <X size={24} />
              </button>
              <div className="mt-8 flex-grow overflow-auto">
                {/* Placeholder for rich text editor */}
                <div className="h-full rounded-lg border-2 border-dashed border-gray-300 p-4">
                  <Editor name='content' content={content} setContent={setContent} onSubmit={handleSubmit} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleDrawer}
        className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 rounded-full bg-white px-6 py-3 text-lg font-semibold text-purple-600 shadow-lg transition-colors hover:bg-purple-100"
        >
          <span>Open Editor</span>
          <ChevronUp size={24} />
        </motion.div>
      </button>
    </div>
  )
}

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null
  }

  return (
    <div className="menu-bar flex justify-between">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'text-primary' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'text-primary' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'text-primary' : ''}
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'text-primary' : ''}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'text-primary' : ''}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'text-primary' : ''}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'text-primary' : ''}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'text-primary' : ''}
      >
        Ordered List
      </button>
    </div>
  )
}

const Editor = ({ content, setContent, onSubmit }:any) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: content,
    onUpdate({ editor }) {
      setContent(editor.getHTML())
    },
    immediatelyRender: false,
  })

  return (
    <div className="editor-container">
      <MenuBar editor={editor} />
      <form action={onSubmit}>
        <input type='hidden' name='content' value={content} />
        <div className='h-48 overflow-y-auto'>
          <EditorContent editor={editor} className='bg-[#f2f2f2] text-black text-xs' />
        </div>
        <button type='submit' className='bg-primary hover:bg-primary/90 text-white p-2 rounded-md mt-4'>
          Save
        </button>
      </form>
    </div>
  )
}