import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion'

const DEFAULT_PROPS = {
  question: 'Who is the Phillies mascot?',
  options: ['Gritty', 'The Phanatic', 'Swoop', 'Franklin'],
  correctAnswer: 'The Phanatic',
  hint: 'Look for the fuzzy green guy!',
  onCorrect: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('MultipleChoiceQuestion', () => {
  describe('rendering', () => {
    it('displays the question and all options', () => {
      // Arrange & Act
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)

      // Assert
      expect(screen.getByText('Who is the Phillies mascot?')).toBeInTheDocument()
      expect(screen.getByText('Gritty')).toBeInTheDocument()
      expect(screen.getByText('The Phanatic')).toBeInTheDocument()
      expect(screen.getByText('Swoop')).toBeInTheDocument()
      expect(screen.getByText('Franklin')).toBeInTheDocument()
    })

    it('does not show the hint initially', () => {
      // Arrange & Act
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)

      // Assert
      expect(screen.queryByText('Look for the fuzzy green guy!')).not.toBeInTheDocument()
    })
  })

  describe('correct answer', () => {
    it('shows the Correct! banner and Next button when the correct answer is tapped', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)

      // Act
      await user.click(screen.getByText('The Phanatic'))

      // Assert
      expect(screen.getByText('Correct!')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('does not call onCorrect when the correct answer is tapped', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)

      // Act
      await user.click(screen.getByText('The Phanatic'))

      // Assert — onCorrect fires on Next, not on answer tap
      expect(DEFAULT_PROPS.onCorrect).not.toHaveBeenCalled()
    })

    it('calls onCorrect when the Next button is tapped', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)
      await user.click(screen.getByText('The Phanatic'))

      // Act
      await user.click(screen.getByRole('button', { name: /next/i }))

      // Assert
      expect(DEFAULT_PROPS.onCorrect).toHaveBeenCalledTimes(1)
    })

    it('hides the hint and shows Correct! when the correct answer is tapped after a wrong one', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)
      await user.click(screen.getByText('Gritty'))
      expect(screen.getByText('Look for the fuzzy green guy!')).toBeInTheDocument()

      // Act
      await user.click(screen.getByText('The Phanatic'))

      // Assert
      expect(screen.queryByText('Look for the fuzzy green guy!')).not.toBeInTheDocument()
      expect(screen.getByText('Correct!')).toBeInTheDocument()
    })
  })

  describe('wrong answers', () => {
    it('disables a wrong answer when tapped and does not call onCorrect', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)

      // Act
      await user.click(screen.getByText('Gritty'))

      // Assert
      expect(DEFAULT_PROPS.onCorrect).not.toHaveBeenCalled()
      expect(screen.getByText('Gritty')).toBeDisabled()
    })

    it('shows the hint after the first wrong answer', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)

      // Act
      await user.click(screen.getByText('Gritty'))

      // Assert
      expect(screen.getByText('Look for the fuzzy green guy!')).toBeInTheDocument()
    })

    it('prevents a greyed-out option from being tapped again', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)
      await user.click(screen.getByText('Gritty'))

      // Act
      await user.click(screen.getByText('Gritty'))

      // Assert — onCorrect still not called, still disabled
      expect(DEFAULT_PROPS.onCorrect).not.toHaveBeenCalled()
      expect(screen.getByText('Gritty')).toBeDisabled()
    })
  })

  describe('last option standing', () => {
    it('highlights the correct answer when all wrong answers are eliminated', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)

      // Act — eliminate all wrong answers
      await user.click(screen.getByText('Gritty'))
      await user.click(screen.getByText('Swoop'))
      await user.click(screen.getByText('Franklin'))

      // Assert — correct answer button has the highlight ring class
      const correctBtn = screen.getByText('The Phanatic')
      expect(correctBtn).toHaveClass('ring-green-400')
      expect(DEFAULT_PROPS.onCorrect).not.toHaveBeenCalled()
    })

    it('still calls onCorrect via Next when highlighted correct answer is tapped', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<MultipleChoiceQuestion {...DEFAULT_PROPS} />)
      await user.click(screen.getByText('Gritty'))
      await user.click(screen.getByText('Swoop'))
      await user.click(screen.getByText('Franklin'))

      // Act
      await user.click(screen.getByText('The Phanatic'))
      await user.click(screen.getByRole('button', { name: /next/i }))

      // Assert
      expect(DEFAULT_PROPS.onCorrect).toHaveBeenCalledTimes(1)
    })
  })
})
