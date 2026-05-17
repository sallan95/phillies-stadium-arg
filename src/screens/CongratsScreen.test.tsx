import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CongratsScreen } from './CongratsScreen'

function renderCongratsScreen() {
  return render(<CongratsScreen />)
}

describe('CongratsScreen', () => {
  describe('Phanatic modal', () => {
    it('opens automatically on mount', () => {
      renderCongratsScreen()

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/a message from the phanatic/i)).toBeInTheDocument()
    })

    it('submitting without entering a name shows "This Fan" on the certificate', async () => {
      const user = userEvent.setup()
      renderCongratsScreen()

      await user.click(screen.getByRole('button', { name: /join the crew/i }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByText('This Fan')).toBeInTheDocument()
    })

    it('submitting with a custom name shows that name on the certificate', async () => {
      const user = userEvent.setup()
      renderCongratsScreen()

      await user.clear(screen.getByLabelText(/your name/i))
      await user.type(screen.getByLabelText(/your name/i), 'Pat')
      await user.click(screen.getByRole('button', { name: /join the crew/i }))

      expect(screen.getByText('Pat')).toBeInTheDocument()
    })

    it('clearing the input and submitting falls back to "This Fan"', async () => {
      const user = userEvent.setup()
      renderCongratsScreen()

      await user.clear(screen.getByLabelText(/your name/i))
      await user.click(screen.getByRole('button', { name: /join the crew/i }))

      expect(screen.getByText('This Fan')).toBeInTheDocument()
    })
  })

  describe('Share button', () => {
    afterEach(() => {
      delete (navigator as unknown as Record<string, unknown>).share
    })

    it('is rendered when navigator.share is available', () => {
      Object.defineProperty(navigator, 'share', {
        value: vi.fn().mockResolvedValue(undefined),
        configurable: true,
        writable: true,
      })
      renderCongratsScreen()

      expect(screen.getByRole('button', { name: /share your achievement/i })).toBeInTheDocument()
    })

    it('is hidden when navigator.share is unavailable', () => {
      renderCongratsScreen()

      expect(screen.queryByRole('button', { name: /share your achievement/i })).not.toBeInTheDocument()
    })

    it('calls navigator.share with the correct payload', async () => {
      const user = userEvent.setup()
      const mockShare = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        configurable: true,
        writable: true,
      })
      renderCongratsScreen()

      await user.click(screen.getByRole('button', { name: /join the crew/i }))
      await user.click(screen.getByRole('button', { name: /share your achievement/i }))

      expect(mockShare).toHaveBeenCalledWith({
        title: 'Scorecard Recovery Crew',
        text: expect.stringContaining('This Fan'),
      })
    })
  })
})
