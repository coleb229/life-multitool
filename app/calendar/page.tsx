"use server"
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import React from 'react';

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="p-24">
      <h1>Calendar Page</h1>
      {/* Add your calendar-related content here */}
    </div>
  );
}