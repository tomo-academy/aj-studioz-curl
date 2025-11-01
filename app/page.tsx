"use client"

import { useState } from "react"
import CurlExecutor from "@/components/curl-executor"
import ResponseViewerNew from "@/components/response-viewer-new"
import Header from "@/components/header-new"
import HistorySidebar from "@/components/history-sidebar"

export default function Home() {
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requestData, setRequestData] = useState<{
    method: string
    url: string
    headers: Record<string, string>
  } | null>(null)
  const [curlCommand, setCurlCommand] = useState("")

  const handleSelectHistory = (curl: string) => {
    setCurlCommand(curl)
    // Trigger a scroll to input for better UX
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.value = curl
      textarea.focus()
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
      <Header />
      {/* Main Content - Responsive split layout */}
      <div className="flex flex-1 overflow-hidden bg-background">
        <HistorySidebar onSelectHistory={handleSelectHistory} />

        {/* Left Panel - Curl Input */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-border overflow-hidden">
          <CurlExecutor
            onResponse={(data) => {
              setResponse(data)
              if (window && (window as any).addCurlToHistory) {
                const parsed = document.querySelector("textarea")?.value || ""
                const url = requestData?.url || "unknown"
                const method = requestData?.method || "GET"
                ;(window as any).addCurlToHistory(parsed, method, url)
              }
            }}
            onLoadingChange={setIsLoading}
            onError={setError}
            onRequestData={setRequestData}
          />
        </div>

        {/* Right Panel - Response Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col border-t lg:border-t-0 border-border overflow-hidden bg-card/30">
          <ResponseViewerNew response={response} isLoading={isLoading} requestData={requestData} />
        </div>
      </div>
    </div>
  )
}
