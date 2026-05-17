import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PieceFoundCelebration } from './PieceFoundCelebration'

const DEFAULT_PROPS = {
  pieceId: 'piece-1',
  pieceNumber: 1,
  onContinue: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('PieceFoundCelebration', () => {
  it('shows the piece number', () => {
    render(<PieceFoundCelebration {...DEFAULT_PROPS} />)
    expect(screen.getByText(/piece 1/i)).toBeInTheDocument()
  })

  it('shows a Phanatic-flavored message', () => {
    render(<PieceFoundCelebration {...DEFAULT_PROPS} />)
    expect(screen.getByText(/phanatic/i)).toBeInTheDocument()
  })

  it('calls onContinue when Continue is tapped', async () => {
    const user = userEvent.setup()
    render(<PieceFoundCelebration {...DEFAULT_PROPS} />)

    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(DEFAULT_PROPS.onContinue).toHaveBeenCalledOnce()
  })
})
