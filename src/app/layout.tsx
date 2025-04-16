
import './globals.css'
import { Outlet } from 'react-router-dom'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Healthify Patient Portal',
  description: 'A modern patient portal for managing medical appointments and healthcare services',
}

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background">
          <header className="bg-primary/10 py-4 border-b border-primary/20">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <a href="/" className="font-bold text-xl text-primary">Healthify</a>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-foreground hover:text-primary transition-colors">Home</a>
                <a href="/appointments" className="text-foreground hover:text-primary transition-colors">Appointments</a>
                <a href="/medications" className="text-foreground hover:text-primary transition-colors">Medications</a>
              </nav>
              <div className="md:hidden">
                {/* Mobile menu button would go here */}
                <button className="text-foreground">Menu</button>
              </div>
            </div>
          </header>
          <main><Outlet /></main>
          <footer className="py-6 bg-muted">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>© 2025 Healthify Patient Portal. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
