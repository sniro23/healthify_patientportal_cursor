
import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Healthify Patient Portal</h1>
        <p className="text-xl text-center mb-4">
          Your modern healthcare management solution
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <a 
            href="/appointments" 
            className="px-6 py-3 bg-primary text-white rounded-md text-center hover:bg-primary/90 transition-colors"
          >
            Book Appointment
          </a>
          <a 
            href="/medications" 
            className="px-6 py-3 bg-secondary text-white rounded-md text-center hover:bg-secondary/90 transition-colors"
          >
            Manage Medications
          </a>
        </div>
      </div>
    </main>
  );
}
