import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StadiumQuiz } from './StadiumQuiz'
import { QUESTIONS } from './stadiumQuizData'

vi.mock('../../components/MultipleChoiceQuestion', () => ({
  MultipleChoiceQuestion: ({
    question,
    onCorrect,
  }: {
    question: string
    onCorrect: () => void
  }) => (
    <div>
      <p>{question}</p>
      <button onClick={onCorrect}>Correct</button>
    </div>
  ),
}))

describe('StadiumQuiz', () => {
  it('shows the first question', () => {
    render(<StadiumQuiz gameId="stadium-quiz" onComplete={vi.fn()} />)
    expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument()
  })

  it('shows the question progress counter', () => {
    render(<StadiumQuiz gameId="stadium-quiz" onComplete={vi.fn()} />)
    expect(screen.getByText(`Question 1 of ${QUESTIONS.length}`)).toBeInTheDocument()
  })

  it('advances to the next question after a correct answer', async () => {
    const user = userEvent.setup()
    render(<StadiumQuiz gameId="stadium-quiz" onComplete={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Correct' }))

    expect(screen.getByText(QUESTIONS[1].question)).toBeInTheDocument()
    expect(screen.getByText(`Question 2 of ${QUESTIONS.length}`)).toBeInTheDocument()
  })

  it('calls onComplete after the last question is answered correctly', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<StadiumQuiz gameId="stadium-quiz" onComplete={onComplete} />)

    for (let i = 0; i < QUESTIONS.length; i++) {
      await user.click(screen.getByRole('button', { name: 'Correct' }))
    }

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('does not call onComplete before the last question', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<StadiumQuiz gameId="stadium-quiz" onComplete={onComplete} />)

    await user.click(screen.getByRole('button', { name: 'Correct' }))

    expect(onComplete).not.toHaveBeenCalled()
  })
})
