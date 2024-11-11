"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BOARD_SIZE = 8
const CANDY_TYPES = ['🍬', '🍭', '🍫', '🍪', '🍩']

type Candy = {
  type: string
  id: number
}

export default function GameBoard() {
  const [board, setBoard] = useState<Candy[][]>([])
  const [selectedCandy, setSelectedCandy] = useState<{ row: number; col: number } | null>(null)
  const [score, setScore] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    initializeBoard()
  }, [])

  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => ({
        type: CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
        id: Math.random()
      }))
    )
    setBoard(newBoard)
  }

  const handleCandyClick = (row: number, col: number) => {
    if (!selectedCandy) {
      setSelectedCandy({ row, col })
    } else {
      if (isAdjacent(selectedCandy, { row, col })) {
        swapCandies(selectedCandy, { row, col })
        setSelectedCandy(null)
      } else {
        setSelectedCandy({ row, col })
      }
    }
  }

  const isAdjacent = (candy1: { row: number; col: number }, candy2: { row: number; col: number }) => {
    const rowDiff = Math.abs(candy1.row - candy2.row)
    const colDiff = Math.abs(candy1.col - candy2.col)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }

  const swapCandies = (candy1: { row: number; col: number }, candy2: { row: number; col: number }) => {
    const newBoard = [...board]
    const temp = newBoard[candy1.row][candy1.col]
    newBoard[candy1.row][candy1.col] = newBoard[candy2.row][candy2.col]
    newBoard[candy2.row][candy2.col] = temp
    setBoard(newBoard)
    checkMatches()
  }

  const checkMatches = () => {
    let matchFound = false
    const newBoard = [...board]

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        if (
          newBoard[row][col].type === newBoard[row][col + 1].type &&
          newBoard[row][col].type === newBoard[row][col + 2].type
        ) {
          newBoard[row][col].type = ''
          newBoard[row][col + 1].type = ''
          newBoard[row][col + 2].type = ''
          matchFound = true
          setScore(prevScore => prevScore + 30)
        }
      }
    }

    // Check vertical matches
    for (let row = 0; row < BOARD_SIZE - 2; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (
          newBoard[row][col].type === newBoard[row + 1][col].type &&
          newBoard[row][col].type === newBoard[row + 2][col].type
        ) {
          newBoard[row][col].type = ''
          newBoard[row + 1][col].type = ''
          newBoard[row + 2][col].type = ''
          matchFound = true
          setScore(prevScore => prevScore + 30)
        }
      }
    }

    if (matchFound) {
      setBoard(newBoard)
      setTimeout(() => {
        fillEmptySpaces()
      }, 300)
    }
  }

  const fillEmptySpaces = () => {
    const newBoard = [...board]
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col].type === '') {
          emptySpaces++
        } else if (emptySpaces > 0) {
          newBoard[row + emptySpaces][col] = newBoard[row][col]
          newBoard[row][col] = { type: '', id: Math.random() }
        }
      }
      for (let row = 0; row < emptySpaces; row++) {
        newBoard[row][col] = {
          type: CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
          id: Math.random()
        }
      }
    }
    setBoard(newBoard)
    checkMatches()
  }

  const handleSubscribe = () => {
    // In a real app, this would trigger the subscription process
    setIsSubscribed(true)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Candy Crush Clone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">Score: {score}</div>
        <div className="grid grid-cols-8 gap-1 mb-4">
          {board.map((row, rowIndex) =>
            row.map((candy, colIndex) => (
              <button
                key={candy.id}
                className={`w-8 h-8 text-2xl flex items-center justify-center ${
                  selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex
                    ? 'bg-blue-200'
                    : 'bg-gray-100'
                }`}
                onClick={() => handleCandyClick(rowIndex, colIndex)}
              >
                {candy.type}
              </button>
            ))
          )}
        </div>
        {!isSubscribed && (
          <Button onClick={handleSubscribe} className="w-full">
            Subscribe for $2/month
          </Button>
        )}
        {isSubscribed && <div className="text-center text-green-500">You are subscribed!</div>}
      </CardContent>
    </Card>
  )
}
