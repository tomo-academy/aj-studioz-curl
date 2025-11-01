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
    icon: {
      url: "/favicon.png",
      type: "image/png",
      sizes: "any",
    },
    apple: "/favicon.png",
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
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
