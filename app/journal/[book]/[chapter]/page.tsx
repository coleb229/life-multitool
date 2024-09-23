"use server"
import { prisma } from "@/lib/prisma"
import UpdateChapterContent from "@/components/custom/UpdateChapterContent";

export default async function Page({ params } : { params: { chapter: string } }) {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapter,
    },
  })

  return (
    <div className="p-24">
      <h1 className="text-primary ml-8 mb-2 font-semibold text-2xl">{chapter?.title}</h1>
      <div className="min-h-screen bg-[#f2f2f2] rounded-lg text-black p-10 tiptap" dangerouslySetInnerHTML={{ __html: chapter?.content as string }} />
      <UpdateChapterContent chapterId={params.chapter} data={chapter} />
    </div>
  );
}