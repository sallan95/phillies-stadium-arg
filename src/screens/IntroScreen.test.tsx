import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { IntroScreen } from './IntroScreen'

function renderIntroScreen() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<IntroScreen />} />
        <Route path="/sequence" element={<div>Sequence Screen</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('IntroScreen', () => {
  it('shows a heading', () => {
    renderIntroScreen()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('shows the story blurb', () => {
    renderIntroScreen()
    expect(screen.getByText(/scorecard/i)).toBeInTheDocument()
  })

  it('shows the Start the Hunt button', () => {
    renderIntroScreen()
    expect(screen.getByRole('button', { name: /start the hunt/i })).toBeInTheDocument()
  })

  it('navigates to the sequence screen when Start the Hunt is tapped', async () => {
    const user = userEvent.setup()
    renderIntroScreen()

    await user.click(screen.getByRole('button', { name: /start the hunt/i }))

    expect(screen.getByText('Sequence Screen')).toBeInTheDocument()
  })
})
