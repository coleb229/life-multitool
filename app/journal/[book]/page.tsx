"use server"
import { prisma } from "@/lib/prisma"
import ChapterList from "@/components/custom/ChapterTable";

export default async function Page({ params } : { params: { book: string } }) {
  const book = await prisma.book.findUnique({
    where: {
      id: params.book,
    },
  })
  const chapters = await prisma.chapter.findMany({
    where: {
      bookId: params.book,
    },
  })

  return (
    <div className="p-24">
      <h1>{book?.title}</h1>
      <p>
        {book?.author}
      </p>
      <ChapterList data={chapters} bookId={params.book} />
    </div>
  );
}