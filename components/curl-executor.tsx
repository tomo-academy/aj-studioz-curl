"use client"

import { useState, useRef } from "react"
import { Copy, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { parseCurlCommand } from "@/lib/curl-parser-new"

interface CurlExecutorProps {
  onResponse: (response: any) => void
  onLoadingChange: (isLoading: boolean) => void
  onError?: (error: string | null) => void
  onRequestData?: (data: { method: string; url: string; headers: Record<string, string> }) => void
}

export default function CurlExecutor({ onResponse, onLoadingChange, onError, onRequestData }: CurlExecutorProps) {
  const [curlCommand, setCurlCommand] = useState(
    'curl -X GET "https://api.github.com/users/github" \\\n  -H "Accept: application/vnd.github.v3+json"',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const curlInputRef = useRef<HTMLTextAreaElement>(null)

  const handleCurlInput = (value: string) => {
    setCurlCommand(value)
    setParseError(null)
  }

  const handleExecute = async () => {
    try {
      setParseError(null)
      const parsed = parseCurlCommand(curlCommand)

      if (!parsed.url.trim()) {
        alert("Please enter a valid URL")
        return
      }

      setIsLoading(true)
      onLoadingChange(true)

      onRequestData?.({
        method: parsed.method,
        url: parsed.url,
        headers: parsed.headers || {},
      })

      const startTime = performance.now()

      const response = await fetch("/api/execute-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: parsed.method,
          url: parsed.url,
          headers: parsed.headers || {},
          body: parsed.body || undefined,
        }),
      })

      const data = await response.json()
      const endTime = performance.now()

      onResponse({
        ...data,
        time: `${Math.round(endTime - startTime)}ms`,
      })
      onError?.(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setParseError(errorMessage)
      onResponse({
        error: "Request failed",
        errorDetails: errorMessage,
      })
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
      onLoadingChange(false)
    }
  }

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand)
    alert("Copied to clipboard!")
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* cURL Input Area */}
      <div className="flex-1 overflow-hidden flex flex-col border-2 border-white/20 m-2 rounded-lg">
        <div className="p-3 sm:p-4 border-b border-border bg-card flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">cURL Preview</label>
          <div className="flex gap-2">
            <Button onClick={copyCurl} variant="outline" size="sm" className="gap-2 bg-transparent text-xs sm:text-sm">
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              Copy
            </Button>
            <Button
              onClick={handleExecute}
              disabled={isLoading}
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <textarea
            ref={curlInputRef}
            value={curlCommand}
            onChange={(e) => handleCurlInput(e.target.value)}
            placeholder="curl -X GET https://api.example.com"
            className="w-full h-full p-3 sm:p-4 bg-input border border-border rounded text-foreground placeholder-muted-foreground text-xs sm:text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {parseError && <p className="text-xs text-destructive mt-2">{parseError}</p>}
        </div>
      </div>
    </div>
  )
}
