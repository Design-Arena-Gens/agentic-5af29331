'use client'

import { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaRobot, FaUser, FaTrash, FaCog, FaLightbulb, FaCode, FaCalculator, FaLanguage, FaSearch } from 'react-icons/fa'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AgentCapability {
  name: string
  icon: React.ReactNode
  description: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome! I\'m your AI agent assistant. I can help you with various tasks like a human would:\n\n• Answer questions and provide information\n• Write and explain code\n• Perform calculations and data analysis\n• Translate languages\n• Research topics\n• Solve problems creatively\n• Generate content and ideas\n• Plan and organize tasks\n\nWhat can I help you with today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const capabilities: AgentCapability[] = [
    { name: 'Problem Solving', icon: <FaLightbulb />, description: 'Creative solutions to complex problems' },
    { name: 'Code Generation', icon: <FaCode />, description: 'Write, debug, and explain code' },
    { name: 'Calculations', icon: <FaCalculator />, description: 'Math, data analysis, and computations' },
    { name: 'Research', icon: <FaSearch />, description: 'Information gathering and analysis' },
    { name: 'Translation', icon: <FaLanguage />, description: 'Multi-language support' },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role === 'system' ? 'assistant' : m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'system',
        content: 'Chat cleared. How can I assist you?',
        timestamp: new Date()
      }
    ])
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-lg border-b border-purple-500 border-opacity-30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <FaRobot className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Agent Assistant</h1>
              <p className="text-sm text-gray-300">Your intelligent work companion</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <FaTrash /> Clear Chat
          </button>
        </div>
      </header>

      {/* Capabilities Bar */}
      <div className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-purple-500 border-opacity-20 p-4">
        <div className="container mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 bg-opacity-20 backdrop-blur-sm border border-purple-400 border-opacity-30 rounded-lg whitespace-nowrap"
                title={cap.description}
              >
                <span className="text-purple-300">{cap.icon}</span>
                <span className="text-sm text-gray-200">{cap.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden container mx-auto p-4">
        <div className="h-full bg-black bg-opacity-30 backdrop-blur-lg rounded-lg border border-purple-500 border-opacity-30 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role !== 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {message.role === 'system' ? <FaCog className="text-white text-sm" /> : <FaRobot className="text-white text-sm" />}
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : message.role === 'system'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-gray-800 bg-opacity-50 backdrop-blur-sm text-gray-100 border border-purple-500 border-opacity-20'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  <div className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500 border-opacity-20">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-purple-500 border-opacity-30">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything... I'm here to help!"
                className="flex-1 px-4 py-3 bg-gray-800 bg-opacity-50 backdrop-blur-sm text-white rounded-lg border border-purple-500 border-opacity-30 focus:outline-none focus:border-purple-500 focus:border-opacity-60 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all flex items-center gap-2 font-medium disabled:cursor-not-allowed"
              >
                <FaPaperPlane /> Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
