import { useState } from 'react'

export interface MultipleChoiceQuestionProps {
  question: string
  options: string[]
  correctAnswer: string
  hint?: string
  onCorrect: () => void
}

export function MultipleChoiceQuestion({
  question,
  options,
  correctAnswer,
  hint,
  onCorrect,
}: MultipleChoiceQuestionProps) {
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([])
  const [solved, setSolved] = useState(false)

  const allWrongEliminated =
    !solved &&
    options
      .filter((o) => o !== correctAnswer)
      .every((o) => eliminatedOptions.includes(o))

  function handleSelect(option: string) {
    if (solved || eliminatedOptions.includes(option)) return

    if (option === correctAnswer) {
      setSolved(true)
    } else {
      setEliminatedOptions((prev) => [...prev, option])
    }
  }

  const showHint = hint && eliminatedOptions.length > 0 && !solved

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-semibold">{question}</p>

      {/* Reserved banner area — always occupies space to prevent layout shift */}
      <div className="min-h-[44px]">
        {solved ? (
          <p className="rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
            Correct!
          </p>
        ) : showHint ? (
          <p className="rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
            {hint}
          </p>
        ) : null}
      </div>

      <ul className="flex flex-col gap-3">
        {options.map((option) => {
          const isEliminated = eliminatedOptions.includes(option)
          const isCorrect = option === correctAnswer
          const isHighlighted = allWrongEliminated && isCorrect

          return (
            <li key={option}>
              <button
                className={[
                  'w-full rounded-xl px-5 py-4 text-left text-lg font-medium transition-colors',
                  'min-h-[48px]',
                  isEliminated
                    ? 'cursor-not-allowed bg-red-100 text-red-400'
                    : isHighlighted
                      ? 'bg-green-100 text-green-900 ring-2 ring-green-400'
                      : solved && isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-900 ring-1 ring-gray-200 active:bg-gray-50',
                ].join(' ')}
                onClick={() => handleSelect(option)}
                disabled={isEliminated || solved}
                aria-disabled={isEliminated}
              >
                {option}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Next button always occupies space to prevent layout shift */}
      <button
        className={[
          'w-full rounded-xl px-5 py-4 text-lg font-bold text-white',
          solved ? 'bg-green-600 active:bg-green-700' : 'invisible',
        ].join(' ')}
        onClick={onCorrect}
        tabIndex={solved ? 0 : -1}
        aria-hidden={!solved}
      >
        Next →
      </button>
    </div>
  )
}
