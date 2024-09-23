"use server"
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import React from 'react';
import BookJournalSearch from '@/components/custom/BookSearch';
import AddBookDialog from '@/components/custom/AddBook';
import { prisma } from '@/lib/prisma';

export default async function JournalPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }

  const data = await prisma.book.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <AddBookDialog />
      <BookJournalSearch data={data} />
    </div>
  );
}