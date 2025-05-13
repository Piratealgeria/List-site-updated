"use client"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">You&apos;re offline</h1>
      <p className="mb-6">Sorry, you appear to be offline. Please check your internet connection and try again.</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}
