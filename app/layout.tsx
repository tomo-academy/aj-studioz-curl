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
        url: "/favicon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <style>
          {`
            /* Make favicon appear circular */
            link[rel="icon"],
            link[rel="apple-touch-icon"] {
              border-radius: 50%;
            }
            
            /* Fix mobile viewport height */
            :root {
              --vh: 1vh;
            }
            
            @supports (-webkit-touch-callout: none) {
              body {
                height: -webkit-fill-available;
              }
            }
          `}
        </style>
      </head>
      <body className={`font-sans antialiased overflow-hidden h-screen max-h-screen`} style={{ height: '100dvh' }}>{children}</body>
    </html>
  )
}
