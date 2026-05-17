import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JigsawPuzzle } from './JigsawPuzzle'

vi.mock('react-jigsaw-puzzle/lib/jigsaw-puzzle', () => ({
  JigsawPuzzle: ({ onSolved }: { onSolved: () => void }) => (
    <button onClick={onSolved}>Solve Puzzle</button>
  ),
}))

vi.mock('react-jigsaw-puzzle/lib/jigsaw-puzzle.css', () => ({}))

describe('JigsawPuzzle', () => {
  it('calls onComplete when the puzzle is solved', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<JigsawPuzzle imageSrc="/test.jpg" onComplete={onComplete} />)

    await user.click(screen.getByText('Solve Puzzle'))

    expect(onComplete).toHaveBeenCalled()
  })
})
