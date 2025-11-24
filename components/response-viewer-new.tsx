"use client"

import { Copy, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import APIMetadataCard from "./api-metadata-card"
import { detectAPIProvider } from "@/lib/api-provider-detector"

interface ResponseViewerNewProps {
  response: any
  isLoading: boolean
  requestData?: { method: string; url: string; headers: Record<string, string> }
}

export default function ResponseViewerNew({ response, isLoading, requestData }: ResponseViewerNewProps) {
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card border-t lg:border-t-0 lg:border-l border-border p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin" />
          <p className="text-xs sm:text-sm text-muted-foreground">Executing request...</p>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card border-t lg:border-t-0 lg:border-l border-border p-4">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">Send a request to see the response</p>
        </div>
      </div>
    )
  }

  if (response.error) {
    return (
      <div className="flex-1 flex flex-col bg-card border-t lg:border-t-0 lg:border-l border-border p-3 sm:p-4 overflow-y-auto">
        <div className="bg-destructive/20 border border-destructive rounded p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-destructive">Error</p>
          <p className="text-xs sm:text-sm text-destructive/90 mt-1">{response.error}</p>
          {response.errorDetails && (
            <p className="text-xs text-destructive/80 mt-2 font-mono">{response.errorDetails}</p>
          )}
        </div>
      </div>
    )
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400"
    if (status >= 300 && status < 400) return "text-blue-400"
    if (status >= 400 && status < 500) return "text-yellow-400"
    return "text-red-400"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const apiProviderInfo = requestData ? detectAPIProvider(requestData.url, requestData.headers, response.data) : null

  return (
    <div className="flex-1 flex flex-col bg-card overflow-hidden min-h-0 p-2">
      <div className="flex-1 flex flex-col border-2 border-white rounded-lg overflow-hidden">
      {/* Top Status Bar - Always Visible */}
      <div className="flex-shrink-0 border-b border-border p-3 sm:p-4 flex items-center justify-between bg-secondary/30">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className={`text-sm sm:text-base font-bold ${getStatusColor(response.status)}`}>{response.status}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border"></div>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground mb-1">Size</p>
            <p className="text-sm font-semibold text-foreground">{formatFileSize(response.size || 0)}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border"></div>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground mb-1">Time</p>
            <p className="text-sm font-semibold text-foreground">{response.time || "N/A"}</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs gap-1 h-auto p-2 hover:bg-primary/10"
        >
          View Details
          <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Main Response Content - Bigger and at top */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-secondary border-b border-border w-full justify-start rounded-none overflow-x-auto">
            <TabsTrigger value="content" className="text-xs sm:text-sm">
              Content
            </TabsTrigger>
            <TabsTrigger value="headers" className="text-xs sm:text-sm">
              Headers
            </TabsTrigger>
            <TabsTrigger value="timing" className="text-xs sm:text-sm">
              Timing
            </TabsTrigger>
            <TabsTrigger value="ai-response" className="text-xs sm:text-sm text-red-500">
              AI's Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="flex-1 overflow-hidden mt-0 p-0">
            <div className="p-3 sm:p-4 h-full overflow-y-auto flex flex-col">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-border flex-shrink-0">
                <p className="text-xs font-semibold text-muted-foreground">Response Body</p>
                <Button size="sm" variant="ghost" onClick={handleCopy} className="text-xs gap-1 h-auto p-1">
                  <Copy className="w-3 h-3" />
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="bg-input p-2 sm:p-3 rounded text-xs text-foreground font-mono whitespace-pre-wrap break-words flex-1 overflow-auto">
                {typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="flex-1 overflow-hidden mt-0 p-0">
            <div className="p-3 sm:p-4 h-full overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Response Headers</p>
              <pre className="bg-input p-2 sm:p-3 rounded text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                {Object.entries(response.headers || {})
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n")}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="flex-1 overflow-hidden mt-0 p-0">
            <div className="p-3 sm:p-4 h-full overflow-y-auto space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Request Timing</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between bg-input p-2 rounded">
                  <span className="text-muted-foreground">Total Time:</span>
                  <span className="text-foreground font-semibold">{response.time || "N/A"}</span>
                </div>
                <p className="text-muted-foreground text-xs pt-2">
                  Detailed timing metrics not available in browser environment. Use curl with -w flag for detailed
                  timing.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-response" className="flex-1 overflow-hidden mt-0 p-0">
            <div className="p-3 sm:p-4 h-full overflow-y-auto">
              <p className="text-xs font-semibold text-red-500 mb-3">AI's Response</p>
              <div className="bg-input p-3 rounded space-y-3">
                {(() => {
                  // Try multiple paths to find AI response
                  const data = response.data
                  
                  // Check output array structure (OpenRouter/Groq extended format)
                  if (data?.output && Array.isArray(data.output)) {
                    const messages = data.output
                      .filter((item: any) => item.type === 'message' || item.type === 'reasoning')
                      .map((item: any) => {
                        if (item.type === 'reasoning' && item.content?.[0]?.text) {
                          return {
                            type: 'reasoning',
                            text: item.content[0].text
                          }
                        }
                        if (item.type === 'message' && item.content?.[0]?.text) {
                          return {
                            type: 'message',
                            text: item.content[0].text
                          }
                        }
                        return null
                      })
                      .filter(Boolean)
                    
                    if (messages.length > 0) {
                      return messages.map((msg: any, idx: number) => (
                        <div key={idx}>
                          <p className="text-xs font-semibold text-white mb-1">
                            {msg.type === 'reasoning' ? '🧠 Reasoning:' : '💬 Message:'}
                          </p>
                          <p className={`text-xs font-mono whitespace-pre-wrap break-words ${
                            msg.type === 'reasoning' ? 'text-red-500' : 'text-yellow-400'
                          }`}>
                            {msg.text}
                          </p>
                        </div>
                      ))
                    }
                  }
                  
                  // Standard OpenAI format
                  if (data?.choices?.[0]?.message?.content) {
                    return (
                      <p className="text-xs text-red-500 font-mono whitespace-pre-wrap break-words">
                        {data.choices[0].message.content}
                      </p>
                    )
                  }
                  
                  // Anthropic format
                  if (data?.content?.[0]?.text) {
                    return (
                      <p className="text-xs text-red-500 font-mono whitespace-pre-wrap break-words">
                        {data.content[0].text}
                      </p>
                    )
                  }
                  
                  // Generic message/content fields
                  if (data?.message?.content) {
                    return (
                      <p className="text-xs text-red-500 font-mono whitespace-pre-wrap break-words">
                        {data.message.content}
                      </p>
                    )
                  }
                  
                  if (data?.content && typeof data.content === 'string') {
                    return (
                      <p className="text-xs text-red-500 font-mono whitespace-pre-wrap break-words">
                        {data.content}
                      </p>
                    )
                  }
                  
                  return (
                    <p className="text-xs text-red-500 font-mono whitespace-pre-wrap break-words">
                      No AI response detected in this response
                    </p>
                  )
                })()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showDetails && apiProviderInfo && response && !response.error && (
        <div className="flex-shrink-0 border-t border-border max-h-72 overflow-y-auto">
          <APIMetadataCard info={apiProviderInfo} status={response.status} time={response.time} />
        </div>
      )}
      </div>
    </div>
  )
}
