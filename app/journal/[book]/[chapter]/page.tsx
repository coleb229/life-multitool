"use server"
import { prisma } from "@/lib/prisma"
import UpdateChapterContent from "@/components/custom/UpdateChapterContent";
import KeywordsDrawer from "@/components/custom/ChapterKeywordsDrawer";

export default async function Page({ params } : { params: { chapter: string } }) {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapter,
    },
  })
  const keywords = await prisma.keyword.findMany({
    where: {
      chapterId: params.chapter,
    },
  })
  const bookId = chapter?.bookId

  return (
    <div className="p-24">
      <h1 className="text-primary ml-8 mb-2 font-semibold text-2xl">{chapter?.title}</h1>
      <KeywordsDrawer chapterId={params.chapter} bookId={bookId as string} data={keywords} />
      <div className="min-h-screen bg-[#f2f2f2] rounded-lg text-black p-10 tiptap" dangerouslySetInnerHTML={{ __html: chapter?.content as string }} />
      <UpdateChapterContent chapterId={params.chapter} data={chapter} />
    </div>
  );
}