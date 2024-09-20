"use server"
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import React from 'react';

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="p-24">
      <h1>Planner Page</h1>
      {/* Add your planner-related content here */}
    </div>
  );
}