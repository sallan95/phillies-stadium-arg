import { useState } from 'react'
import type { GameProps } from '../types'
import { MultipleChoiceQuestion } from '../../components/MultipleChoiceQuestion'
import { QUESTIONS, PIECE_ID } from './playerData'

export function NameThatPlayer({ onComplete }: GameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const question = QUESTIONS[currentIndex]
  const isLastQuestion = currentIndex === QUESTIONS.length - 1

  function handleCorrect() {
    if (isLastQuestion) {
      onComplete(PIECE_ID)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <p className="mb-6 text-right text-sm text-gray-500">
        Question {currentIndex + 1} of {QUESTIONS.length}
      </p>
      <MultipleChoiceQuestion
        key={currentIndex}
        question={question.question}
        options={question.options}
        correctAnswer={question.correctAnswer}
        hint={question.hint}
        onCorrect={handleCorrect}
      />
    </div>
  )
}
