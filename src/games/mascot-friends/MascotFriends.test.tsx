import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MascotFriends } from './MascotFriends'
import { ROUNDS } from './mascotData'

function renderGame(onComplete = vi.fn()) {
  return render(<MascotFriends gameId="mascot-friends" onComplete={onComplete} />)
}

describe('MascotFriends', () => {
  it('shows the round counter', () => {
    renderGame()
    expect(screen.getByText(`Round 1 of ${ROUNDS.length}`)).toBeInTheDocument()
  })

  it('renders 4 mascot cards', () => {
    renderGame()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('shows all mascot names for round 1', () => {
    renderGame()
    const round = ROUNDS[0]
    expect(screen.getByText(round.correct.name)).toBeInTheDocument()
    round.wrong.forEach((m) => expect(screen.getByText(m.name)).toBeInTheDocument())
  })

  it('disables a wrong card after it is clicked', async () => {
    const user = userEvent.setup()
    renderGame()

    const wrongName = ROUNDS[0].wrong[0].name
    const wrongButton = screen.getByRole('button', { name: new RegExp(wrongName) })
    await user.click(wrongButton)

    expect(wrongButton).toBeDisabled()
  })

  it('shows the celebration banner after a correct answer', async () => {
    const user = userEvent.setup()
    renderGame()

    const correctName = ROUNDS[0].correct.name
    await user.click(screen.getByRole('button', { name: new RegExp(correctName) }))

    expect(screen.getByText(/phanatic's friend/i)).toBeInTheDocument()
  })

  it('disables all mascot cards after a correct answer', async () => {
    const user = userEvent.setup()
    renderGame()

    await user.click(screen.getByRole('button', { name: new RegExp(ROUNDS[0].correct.name) }))

    const mascotButtons = screen.getAllByRole('button').filter(
      (b) => !b.textContent?.includes('→'),
    )
    mascotButtons.forEach((b) => expect(b).toBeDisabled())
  })

  it('advances to round 2 after clicking Next Round', async () => {
    const user = userEvent.setup()
    renderGame()

    await user.click(screen.getByRole('button', { name: new RegExp(ROUNDS[0].correct.name) }))
    await user.click(screen.getByRole('button', { name: /next round/i }))

    expect(screen.getByText(`Round 2 of ${ROUNDS.length}`)).toBeInTheDocument()
    expect(screen.getByText(ROUNDS[1].correct.name)).toBeInTheDocument()
  })

  it('resets rejected cards when advancing to the next round', async () => {
    const user = userEvent.setup()
    renderGame()

    const wrongName = ROUNDS[0].wrong[0].name
    await user.click(screen.getByRole('button', { name: new RegExp(wrongName) }))
    await user.click(screen.getByRole('button', { name: new RegExp(ROUNDS[0].correct.name) }))
    await user.click(screen.getByRole('button', { name: /next round/i }))

    const allButtons = screen.getAllByRole('button')
    allButtons.forEach((b) => {
      if (!b.textContent?.includes('→')) expect(b).not.toBeDisabled()
    })
  })

  it('calls onComplete after the last round is won', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    renderGame(onComplete)

    for (let i = 0; i < ROUNDS.length; i++) {
      await user.click(screen.getByRole('button', { name: new RegExp(ROUNDS[i].correct.name) }))
      if (i < ROUNDS.length - 1) {
        await user.click(screen.getByRole('button', { name: /next round/i }))
      }
    }

    await user.click(screen.getByRole('button', { name: /collect your piece/i }))

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('does not call onComplete before the last round', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    renderGame(onComplete)

    await user.click(screen.getByRole('button', { name: new RegExp(ROUNDS[0].correct.name) }))
    await user.click(screen.getByRole('button', { name: /next round/i }))

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('shows "Collect Your Piece" instead of "Next Round" on the last round', async () => {
    const user = userEvent.setup()
    renderGame()

    for (let i = 0; i < ROUNDS.length - 1; i++) {
      await user.click(screen.getByRole('button', { name: new RegExp(ROUNDS[i].correct.name) }))
      await user.click(screen.getByRole('button', { name: /next round/i }))
    }

    await user.click(screen.getByRole('button', { name: new RegExp(ROUNDS[ROUNDS.length - 1].correct.name) }))

    expect(screen.getByRole('button', { name: /collect your piece/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next round/i })).not.toBeInTheDocument()
  })
})
