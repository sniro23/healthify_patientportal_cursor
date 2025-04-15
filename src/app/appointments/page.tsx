import { Suspense } from 'react'
import { Metadata } from "next";
import AppointmentBooking from '@/components/appointments/AppointmentBooking'
import ErrorBoundary from '@/components/appointments/ErrorBoundary'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Book Appointment | Healthify",
  description: "Book your next medical appointment with Healthify",
};

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <AppointmentBooking />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
} 