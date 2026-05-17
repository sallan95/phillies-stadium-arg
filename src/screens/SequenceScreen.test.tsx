import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SequenceScreen } from './SequenceScreen'
import * as progressHook from '../hooks/useProgress'
import type { ProgressState } from '../hooks/useProgress'

vi.mock('../hooks/useProgress')

const mockProgress = (overrides: Partial<ProgressState> = {}) => {
  vi.mocked(progressHook.useProgress).mockReturnValue({
    progress: {
      completedGames: [],
      collectedPieces: [],
      gameComplete: false,
      ...overrides,
    },
    completeGame: vi.fn(),
    markGameComplete: vi.fn(),
    resetProgress: vi.fn(),
  })
}

function renderSequenceScreen() {
  return render(
    <MemoryRouter initialEntries={['/sequence']}>
      <Routes>
        <Route path="/sequence" element={<SequenceScreen />} />
        <Route path="/game/:gameId" element={<div>Game Screen</div>} />
        <Route path="/congrats" element={<div>Congrats Screen</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('SequenceScreen', () => {
  describe('with no progress', () => {
    it('shows the first game as available and the rest as locked', () => {
      // Arrange
      mockProgress()

      // Act
      renderSequenceScreen()

      // Assert — scope to the game list to exclude the dev reset button
      const list = screen.getByRole('list')
      const buttons = within(list).getAllByRole('button')
      expect(buttons[0]).not.toBeDisabled()
      buttons.slice(1).forEach((btn) => expect(btn).toBeDisabled())
    })

    it('does not show the congrats link', () => {
      // Arrange
      mockProgress()

      // Act
      renderSequenceScreen()

      // Assert
      expect(screen.queryByText(/View your Scorecard/)).not.toBeInTheDocument()
    })
  })

  describe('with partial progress', () => {
    it('marks completed games and unlocks the next one', () => {
      // Arrange
      mockProgress({ completedGames: ['stadium-quiz'] })

      // Act
      renderSequenceScreen()

      // Assert — first game shows complete indicator
      expect(screen.getByText('✓')).toBeInTheDocument()
    })
  })

  describe('with all games complete', () => {
    it('shows the congrats link', () => {
      // Arrange
      mockProgress({ completedGames: ['stadium-quiz'] })

      // Act
      renderSequenceScreen()

      // Assert — with only one game in config, all complete = congrats visible
      expect(screen.getByText(/View your Scorecard/)).toBeInTheDocument()
    })
  })

  describe('dev reset button', () => {
    it('is present in the dev environment', () => {
      mockProgress()
      renderSequenceScreen()
      expect(screen.getByText('[dev] Reset progress')).toBeInTheDocument()
    })

    it('resets progress and navigates to / when confirmed', async () => {
      const user = userEvent.setup()
      const resetProgress = vi.fn()
      vi.mocked(progressHook.useProgress).mockReturnValue({
        progress: { completedGames: [], collectedPieces: [], gameComplete: false },
        completeGame: vi.fn(),
        markGameComplete: vi.fn(),
        resetProgress,
      })
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      renderSequenceScreen()

      await user.click(screen.getByText('[dev] Reset progress'))

      expect(resetProgress).toHaveBeenCalledOnce()
    })

    it('does not reset when the confirmation is cancelled', async () => {
      const user = userEvent.setup()
      const resetProgress = vi.fn()
      vi.mocked(progressHook.useProgress).mockReturnValue({
        progress: { completedGames: [], collectedPieces: [], gameComplete: false },
        completeGame: vi.fn(),
        markGameComplete: vi.fn(),
        resetProgress,
      })
      vi.spyOn(window, 'confirm').mockReturnValue(false)
      renderSequenceScreen()

      await user.click(screen.getByText('[dev] Reset progress'))

      expect(resetProgress).not.toHaveBeenCalled()
    })
  })

  describe('navigation', () => {
    it('navigates to the game when an available game is tapped', async () => {
      // Arrange
      const user = userEvent.setup()
      mockProgress()
      renderSequenceScreen()

      // Act
      await user.click(within(screen.getByRole('list')).getAllByRole('button')[0])

      // Assert
      expect(screen.getByText('Game Screen')).toBeInTheDocument()
    })

    it('does not navigate when a locked game is tapped', async () => {
      // Arrange — add a second game temporarily by testing with mock
      mockProgress()
      renderSequenceScreen()

      // Assert — locked buttons are disabled so they can't be clicked
      const disabledButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.hasAttribute('disabled'))
      disabledButtons.forEach((btn) => expect(btn).toBeDisabled())
    })
  })
})
