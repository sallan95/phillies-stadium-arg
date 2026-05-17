import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'
import * as progressHook from './hooks/useProgress'
import type { ProgressState } from './hooks/useProgress'

vi.mock('./hooks/useProgress')

vi.mock('./config/games', () => ({
  GAMES: [
    {
      gameId: 'test-game',
      pieceId: 'piece-1',
      displayName: 'Test Game',
      description: 'A test game',
      component: ({ onComplete }: { gameId: string; onComplete: (pieceId: string) => void }) => (
        <button onClick={() => onComplete('piece-1')}>Complete Game</button>
      ),
    },
  ],
}))

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

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  )
}

describe('dev reset button', () => {
  it('is visible on every page', () => {
    mockProgress()
    renderApp('/')
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
    renderApp('/')

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
    renderApp('/')

    await user.click(screen.getByText('[dev] Reset progress'))

    expect(resetProgress).not.toHaveBeenCalled()
  })
})

describe('piece found celebration', () => {
  it('shows the celebration modal when a game calls onComplete', async () => {
    const user = userEvent.setup()
    mockProgress()
    renderApp('/game/test-game')

    await user.click(screen.getByText('Complete Game'))

    expect(screen.getByText(/you found piece/i)).toBeInTheDocument()
  })

  it('navigates to the sequence screen when Continue is tapped', async () => {
    const user = userEvent.setup()
    mockProgress()
    renderApp('/game/test-game')
    await user.click(screen.getByText('Complete Game'))

    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByText('The Hunt')).toBeInTheDocument()
  })
})
