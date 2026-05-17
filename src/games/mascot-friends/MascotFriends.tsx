import { useState, useMemo } from 'react'
import type { GameProps } from '../types'
import { ROUNDS, PIECE_ID } from './mascotData'
import type { Mascot } from './mascotData'

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function MascotFriends({ onComplete }: GameProps) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [rejected, setRejected] = useState<Set<string>>(new Set())
  const [roundWon, setRoundWon] = useState(false)

  const round = ROUNDS[roundIndex]
  const isLastRound = roundIndex === ROUNDS.length - 1

  const cards = useMemo(
    () => shuffle([...ROUNDS[roundIndex].wrong, ROUNDS[roundIndex].correct]),
    [roundIndex],
  )

  function handleSelect(mascot: Mascot) {
    if (mascot.name === round.correct.name) {
      setRoundWon(true)
    } else {
      setRejected((prev) => new Set(prev).add(mascot.name))
    }
  }

  function handleAdvance() {
    if (isLastRound) {
      onComplete(PIECE_ID)
    } else {
      setRoundIndex((i) => i + 1)
      setRejected(new Set())
      setRoundWon(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <p className="mb-2 text-right text-sm text-gray-500">
        Round {roundIndex + 1} of {ROUNDS.length}
      </p>
      <h1 className="mb-6 text-2xl font-bold">Pick the Phanatic's friend!</h1>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((mascot) => {
          const isRejected = rejected.has(mascot.name)
          return (
            <button
              key={mascot.name}
              disabled={isRejected || roundWon}
              onClick={() => handleSelect(mascot)}
              className={[
                'rounded-xl border-2 p-3 text-center transition-opacity',
                isRejected
                  ? 'cursor-not-allowed border-gray-200 opacity-30'
                  : roundWon && mascot.name === round.correct.name
                    ? 'border-green-500'
                    : roundWon
                      ? 'border-gray-200 opacity-50'
                      : 'border-red-600 active:bg-red-50',
              ].join(' ')}
            >
              <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={mascot.imageSrc}
                  alt={mascot.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <p className="text-sm font-medium">{mascot.name}</p>
            </button>
          )
        })}
      </div>

      {roundWon && (
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-center">
          <p className="mb-3 font-bold text-green-700">
            That's a Phanatic friend! ✓
          </p>
          <button
            className="w-full rounded-xl bg-red-600 px-8 py-3 font-bold text-white active:bg-red-700"
            onClick={handleAdvance}
          >
            {isLastRound ? 'Collect Your Piece →' : 'Next Round →'}
          </button>
        </div>
      )}
    </div>
  )
}
