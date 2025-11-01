"use client"

import { useState, useEffect } from "react"
import { Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface HistoryItem {
  id: string
  curl: string
  method: string
  url: string
  timestamp: number
}

interface HistorySidebarProps {
  onSelectHistory: (curl: string) => void
}

export default function HistorySidebar({ onSelectHistory }: HistorySidebarProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isOpen, setIsOpen] = useState(true)

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("curlHistory")
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load history:", e)
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("curlHistory", JSON.stringify(history))
  }, [history])

  const addToHistory = (curl: string, method: string, url: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      curl,
      method,
      url,
      timestamp: Date.now(),
    }
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]) // Keep last 50 items
  }

  // Export function to be used by parent component
  useEffect(() => {
    ;(window as any).addCurlToHistory = addToHistory
  }, [])

  const deleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setHistory([])
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <>
      {/* Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg"
        title="Toggle history sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static left-0 top-0 h-screen lg:h-[calc(100vh-80px)] w-64 bg-card border-r border-border z-40 lg:z-0 transition-transform flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Request History</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-secondary rounded"
              title="Close sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              <p>No requests yet</p>
              <p className="text-xs mt-2">Your request history will appear here</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 bg-input border-border hover:border-primary cursor-pointer transition-all group"
                  onClick={() => {
                    onSelectHistory(item.curl)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-mono bg-primary/20 text-primary rounded">
                      {item.method}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</span>
                  </div>
                  <p className="text-xs text-foreground font-mono truncate mb-2 group-hover:text-primary transition-colors">
                    {item.url}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(item.curl)
                      }}
                      className="flex-1 p-1 text-xs bg-secondary/50 hover:bg-secondary rounded transition-colors"
                      title="Copy curl command"
                    >
                      <Copy className="w-3 h-3 inline" /> Copy
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteItem(item.id)
                      }}
                      className="p-1 text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive rounded transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-border bg-background">
            <Button
              onClick={clearHistory}
              variant="outline"
              size="sm"
              className="w-full text-xs bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              Clear History
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
