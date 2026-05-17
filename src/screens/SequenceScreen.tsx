import { useNavigate } from 'react-router-dom'
import { GAMES } from '../config/games'
import { useProgress } from '../hooks/useProgress'

export function SequenceScreen() {
  const navigate = useNavigate()
  const { progress, resetProgress } = useProgress()

  function handleReset() {
    if (window.confirm('Reset all progress and return to the start?')) {
      resetProgress()
      navigate('/')
    }
  }

  const allGamesComplete = GAMES.every((g) =>
    progress.completedGames.includes(g.gameId)
  )

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-2 text-2xl font-bold">The Hunt</h1>
      <p className="mb-6 text-gray-500">Help the Phanatic recover his scorecard!</p>

      <ul className="flex flex-col gap-3">
        {GAMES.map((game, index) => {
          const isComplete = progress.completedGames.includes(game.gameId)
          const isAvailable =
            !isComplete &&
            GAMES.slice(0, index).every((g) =>
              progress.completedGames.includes(g.gameId)
            )

          return (
            <li key={game.gameId}>
              <button
                className={[
                  'w-full rounded-xl p-4 text-left transition-colors',
                  isComplete
                    ? 'bg-green-50 text-green-800'
                    : isAvailable
                      ? 'bg-red-600 text-white active:bg-red-700'
                      : 'bg-gray-100 text-gray-400',
                ].join(' ')}
                onClick={() => isAvailable && navigate(`/game/${game.gameId}`)}
                disabled={!isAvailable && !isComplete}
                aria-disabled={!isAvailable && !isComplete}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">{game.displayName}</p>
                    <p className="text-sm opacity-80">{game.description}</p>
                  </div>
                  <span className="ml-4 text-xl">
                    {isComplete ? '✓' : isAvailable ? '→' : '🔒'}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {allGamesComplete && (
        <button
          className="mt-6 w-full rounded-xl bg-green-600 p-4 text-center text-lg font-bold text-white active:bg-green-700"
          onClick={() => navigate('/congrats')}
        >
          View your Scorecard →
        </button>
      )}

      {import.meta.env.DEV && (
        <div className="mt-12 flex justify-center">
          <button
            className="rounded px-3 py-1 text-xs text-gray-400 underline"
            onClick={handleReset}
          >
            [dev] Reset progress
          </button>
        </div>
      )}
    </div>
  )
}
