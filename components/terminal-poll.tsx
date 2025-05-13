"use client"

import { useState, useEffect } from "react"
import { BarChart, CheckCircle, RefreshCw } from "lucide-react"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface TerminalPollProps {
  id: string
  question: string
  options: PollOption[]
  isDarkMode: boolean
  expiresAt?: string
}

export default function TerminalPoll({
  id,
  question,
  options: initialOptions,
  isDarkMode,
  expiresAt,
}: TerminalPollProps) {
  const [options, setOptions] = useState<PollOption[]>(initialOptions)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  // Check if user has already voted
  useEffect(() => {
    const voted = localStorage.getItem(`poll_${id}`)
    if (voted) {
      setHasVoted(true)
      setSelectedOption(voted)
      setShowResults(true)
    }
  }, [id])

  // Calculate time left if poll has expiration
  useEffect(() => {
    if (!expiresAt) return

    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft("Expired")
        setShowResults(true)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`)
      } else {
        setTimeLeft(`${minutes}m left`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [expiresAt])

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0)

  const handleVote = () => {
    if (!selectedOption || hasVoted) return

    // In a real app, you would send this to your API
    const updatedOptions = options.map((option) => {
      if (option.id === selectedOption) {
        return { ...option, votes: option.votes + 1 }
      }
      return option
    })

    setOptions(updatedOptions)
    setHasVoted(true)
    setShowResults(true)

    // Save in localStorage to prevent multiple votes
    localStorage.setItem(`poll_${id}`, selectedOption)
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  // Generate ASCII bar chart
  const generateAsciiBar = (percentage: number) => {
    const maxLength = 20
    const filledLength = Math.round((percentage / 100) * maxLength)
    const emptyLength = maxLength - filledLength

    return "█".repeat(filledLength) + "░".repeat(emptyLength)
  }

  return (
    <div className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-4 my-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart className="h-4 w-4 text-yellow-500" />
          <h3 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>POLL: {question}</h3>
        </div>
        {timeLeft && (
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} flex items-center gap-1`}>
            <RefreshCw className="h-3 w-3" />
            {timeLeft}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex flex-col">
            <div className="flex items-center mb-1">
              <label className="flex items-center cursor-pointer flex-grow">
                <input
                  type="radio"
                  name={`poll_${id}`}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  disabled={hasVoted || timeLeft === "Expired"}
                  className="mr-2 accent-green-500"
                />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{option.text}</span>
              </label>

              {showResults && (
                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {getPercentage(option.votes)}% ({option.votes})
                </span>
              )}
            </div>

            {showResults && (
              <div className="flex items-center gap-2">
                <div
                  className={`font-mono text-xs ${option.id === selectedOption ? "text-green-500" : isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  {generateAsciiBar(getPercentage(option.votes))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        {!hasVoted && timeLeft !== "Expired" ? (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className={`px-3 py-1 text-xs ${isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-500"} text-white rounded disabled:opacity-50`}
          >
            Vote
          </button>
        ) : (
          <div className="flex items-center gap-1 text-xs text-green-500">
            <CheckCircle className="h-3 w-3" />
            {timeLeft === "Expired" ? "Poll closed" : "Vote recorded"}
          </div>
        )}

        <button
          onClick={() => setShowResults(!showResults)}
          className={`text-xs ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
        >
          {showResults ? "Hide results" : "Show results"}
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-right">Total votes: {totalVotes}</div>
    </div>
  )
}
