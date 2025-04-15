export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Healthify Patient Portal</h1>
        <p className="text-xl mb-4">Your healthcare journey starts here</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Book Appointments</h2>
            <p>Schedule your medical appointments with ease</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Home Visits</h2>
            <p>Request healthcare services at your doorstep</p>
          </div>
        </div>
      </div>
    </main>
  )
} 