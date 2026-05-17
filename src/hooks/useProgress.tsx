import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface ProgressState {
  completedGames: string[]
  collectedPieces: string[]
  gameComplete: boolean
}

const STORAGE_KEY = 'phillies-arg-progress'

const EMPTY_PROGRESS: ProgressState = {
  completedGames: [],
  collectedPieces: [],
  gameComplete: false,
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    return JSON.parse(raw) as ProgressState
  } catch {
    return EMPTY_PROGRESS
  }
}

function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

interface ProgressContextValue {
  progress: ProgressState
  completeGame: (gameId: string, pieceId: string) => void
  markGameComplete: () => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  const completeGame = useCallback((gameId: string, pieceId: string) => {
    setProgress((prev) => {
      if (prev.completedGames.includes(gameId)) return prev
      const next = {
        ...prev,
        completedGames: [...prev.completedGames, gameId],
        collectedPieces: [...prev.collectedPieces, pieceId],
      }
      saveProgress(next)
      return next
    })
  }, [])

  const markGameComplete = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, gameComplete: true }
      saveProgress(next)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProgress(EMPTY_PROGRESS)
  }, [])

  return (
    <ProgressContext.Provider value={{ progress, completeGame, markGameComplete, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
