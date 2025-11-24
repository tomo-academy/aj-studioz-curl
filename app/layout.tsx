import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AJ STUDIOZ - Professional cURL Tester & API Client",
  description: "Test and debug API requests with AJ STUDIOZ - the professional online curl command testing platform",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/aj-logo.png",
        type: "image/png",
        sizes: "any",
      },
    ],
    apple: "/aj-logo.png",
    shortcut: "/aj-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/aj-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/aj-logo.png" />
        <style>
          {`
            /* Make favicon appear circular */
            link[rel="icon"],
            link[rel="apple-touch-icon"] {
              border-radius: 50%;
            }
          `}
        </style>
      </head>
      <body className={`font-sans antialiased overflow-hidden h-screen`}>{children}</body>
    </html>
  )
}
