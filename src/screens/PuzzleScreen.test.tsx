import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PuzzleScreen } from './PuzzleScreen'
import * as progressHook from '../hooks/useProgress'

vi.mock('../hooks/useProgress')

vi.mock('react-jigsaw-puzzle/lib/jigsaw-puzzle', () => ({
  JigsawPuzzle: ({ onSolved }: { onSolved: () => void }) => (
    <button onClick={onSolved}>Solve Puzzle</button>
  ),
}))

vi.mock('react-jigsaw-puzzle/lib/jigsaw-puzzle.css', () => ({}))

const mockMarkGameComplete = vi.fn()

beforeEach(() => {
  mockMarkGameComplete.mockReset()
  vi.mocked(progressHook.useProgress).mockReturnValue({
    progress: { completedGames: [], collectedPieces: [], gameComplete: false },
    completeGame: vi.fn(),
    markGameComplete: mockMarkGameComplete,
    resetProgress: vi.fn(),
  })
})

function renderPuzzleScreen() {
  return render(
    <MemoryRouter initialEntries={['/puzzle']}>
      <Routes>
        <Route path="/puzzle" element={<PuzzleScreen />} />
        <Route path="/congrats" element={<div>Congrats Screen</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PuzzleScreen', () => {
  it('renders the puzzle', () => {
    renderPuzzleScreen()

    expect(screen.getByRole('heading', { name: /rebuild the scorecard/i })).toBeInTheDocument()
    expect(screen.getByText('Solve Puzzle')).toBeInTheDocument()
  })

  it('shows the completion modal when the puzzle is solved', async () => {
    const user = userEvent.setup()
    renderPuzzleScreen()

    await user.click(screen.getByText('Solve Puzzle'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/you did it/i)).toBeInTheDocument()
  })

  it('calls markGameComplete and navigates to /congrats when Continue is tapped', async () => {
    const user = userEvent.setup()
    renderPuzzleScreen()

    await user.click(screen.getByText('Solve Puzzle'))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(mockMarkGameComplete).toHaveBeenCalledOnce()
    expect(screen.getByText('Congrats Screen')).toBeInTheDocument()
  })
})
