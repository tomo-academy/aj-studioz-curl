"use client"

import Image from "next/image"

export default function Header() {

  return (
    <>
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-full bg-black flex items-center justify-center border-2 border-red-600 shadow-lg shadow-red-500/50">
            <Image
              src="/aj-logo.png"
              alt="AJ STUDIOZ"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold rgb-glow-text">AJ STUDIOZ</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Professional cURL Tester</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile menu icon */}
          <button className="sm:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
    </>
  )
}
