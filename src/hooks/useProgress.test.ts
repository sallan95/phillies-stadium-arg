import { renderHook, act } from '@testing-library/react'
import { useProgress, ProgressProvider } from './useProgress'

const wrapper = ProgressProvider

beforeEach(() => {
  localStorage.clear()
})

describe('useProgress', () => {
  describe('initial state', () => {
    it('returns empty progress when localStorage is empty', () => {
      // Arrange & Act
      const { result } = renderHook(() => useProgress(), { wrapper })

      // Assert
      expect(result.current.progress.completedGames).toEqual([])
      expect(result.current.progress.collectedPieces).toEqual([])
      expect(result.current.progress.gameComplete).toBe(false)
    })

    it('loads existing progress from localStorage on mount', () => {
      // Arrange
      const saved = {
        completedGames: ['stadium-quiz'],
        collectedPieces: ['piece-1'],
        gameComplete: false,
      }
      localStorage.setItem('phillies-arg-progress', JSON.stringify(saved))

      // Act
      const { result } = renderHook(() => useProgress(), { wrapper })

      // Assert
      expect(result.current.progress.completedGames).toEqual(['stadium-quiz'])
      expect(result.current.progress.collectedPieces).toEqual(['piece-1'])
    })

    it('returns empty progress when localStorage contains invalid JSON', () => {
      // Arrange
      localStorage.setItem('phillies-arg-progress', 'not-valid-json')

      // Act
      const { result } = renderHook(() => useProgress(), { wrapper })

      // Assert
      expect(result.current.progress.completedGames).toEqual([])
    })
  })

  describe('completeGame', () => {
    it('adds the gameId and pieceId to progress', () => {
      // Arrange
      const { result } = renderHook(() => useProgress(), { wrapper })

      // Act
      act(() => {
        result.current.completeGame('stadium-quiz', 'piece-1')
      })

      // Assert
      expect(result.current.progress.completedGames).toContain('stadium-quiz')
      expect(result.current.progress.collectedPieces).toContain('piece-1')
    })

    it('persists progress to localStorage', () => {
      // Arrange
      const { result } = renderHook(() => useProgress(), { wrapper })

      // Act
      act(() => {
        result.current.completeGame('stadium-quiz', 'piece-1')
      })

      // Assert
      const stored = JSON.parse(localStorage.getItem('phillies-arg-progress')!)
      expect(stored.completedGames).toContain('stadium-quiz')
    })

    it('does not add a duplicate if the game is already complete', () => {
      // Arrange
      const { result } = renderHook(() => useProgress(), { wrapper })
      act(() => {
        result.current.completeGame('stadium-quiz', 'piece-1')
      })

      // Act
      act(() => {
        result.current.completeGame('stadium-quiz', 'piece-1')
      })

      // Assert
      expect(result.current.progress.completedGames).toHaveLength(1)
      expect(result.current.progress.collectedPieces).toHaveLength(1)
    })
  })

  describe('markGameComplete', () => {
    it('sets gameComplete to true and persists it', () => {
      // Arrange
      const { result } = renderHook(() => useProgress(), { wrapper })

      // Act
      act(() => {
        result.current.markGameComplete()
      })

      // Assert
      expect(result.current.progress.gameComplete).toBe(true)
      const stored = JSON.parse(localStorage.getItem('phillies-arg-progress')!)
      expect(stored.gameComplete).toBe(true)
    })
  })

  describe('resetProgress', () => {
    it('clears all progress from state and localStorage', () => {
      // Arrange
      const { result } = renderHook(() => useProgress(), { wrapper })
      act(() => {
        result.current.completeGame('stadium-quiz', 'piece-1')
      })

      // Act
      act(() => {
        result.current.resetProgress()
      })

      // Assert
      expect(result.current.progress.completedGames).toEqual([])
      expect(result.current.progress.collectedPieces).toEqual([])
      expect(result.current.progress.gameComplete).toBe(false)
      expect(localStorage.getItem('phillies-arg-progress')).toBeNull()
    })
  })
})
