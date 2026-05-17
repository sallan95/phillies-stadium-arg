import { createContext, useContext } from 'react'

export interface ProgressState {
  completedGames: string[]
  collectedPieces: string[]
  gameComplete: boolean
}

export interface ProgressContextValue {
  progress: ProgressState
  completeGame: (gameId: string, pieceId: string) => void
  markGameComplete: () => void
  resetProgress: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
