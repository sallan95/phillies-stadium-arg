import { useState, useCallback } from 'react'

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

export function useProgress() {
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

  return { progress, completeGame, markGameComplete, resetProgress }
}
