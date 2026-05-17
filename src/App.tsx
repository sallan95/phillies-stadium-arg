import { useState } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import { IntroScreen } from './screens/IntroScreen'
import { SequenceScreen } from './screens/SequenceScreen'
import { PuzzleScreen } from './screens/PuzzleScreen'
import { CongratsScreen } from './screens/CongratsScreen'
import { PieceFoundCelebration } from './components/PieceFoundCelebration'
import { GAMES } from './config/games'
import { useProgress } from './hooks/useProgress'

export function App() {
  const { progress, resetProgress } = useProgress()
  const navigate = useNavigate()

  const defaultRoute = (() => {
    if (progress.gameComplete) return '/congrats'
    if (progress.completedGames.length > 0) return '/sequence'
    return '/'
  })()

  function handleReset() {
    if (window.confirm('Reset all progress and return to the start?')) {
      resetProgress()
      navigate('/')
    }
  }

  return (
    <>
    <Routes>
      <Route path="/" element={
        progress.completedGames.length > 0
          ? <Navigate to={defaultRoute} replace />
          : <IntroScreen />
      } />
      <Route path="/sequence" element={<SequenceScreen />} />
      <Route path="/puzzle" element={
        progress.completedGames.length > 0
          ? <PuzzleScreen />
          : <Navigate to="/" replace />
      } />
      <Route path="/congrats" element={
        progress.gameComplete
          ? <CongratsScreen />
          : <Navigate to="/" replace />
      } />
      <Route path="/game/:gameId" element={<GameRoute />} />
      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
    {import.meta.env.DEV && (
      <div className="pointer-events-none fixed bottom-4 left-0 right-0 flex justify-center">
        <button
          className="pointer-events-auto rounded px-3 py-1 text-xs text-gray-400 underline"
          onClick={handleReset}
        >
          [dev] Reset progress
        </button>
      </div>
    )}
    </>
  )
}

function GameRoute() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { completeGame } = useProgress()
  const game = GAMES.find((g) => g.gameId === gameId)
  const [celebrationPieceId, setCelebrationPieceId] = useState<string | null>(null)

  if (!game) return <Navigate to="/sequence" replace />

  const GameComponent = game.component
  const pieceNumber = GAMES.indexOf(game) + 1

  return (
    <>
      <GameComponent
        gameId={game.gameId}
        onComplete={(pieceId) => {
          completeGame(game.gameId, pieceId)
          setCelebrationPieceId(pieceId)
        }}
      />
      {celebrationPieceId && (
        <PieceFoundCelebration
          pieceId={celebrationPieceId}
          pieceNumber={pieceNumber}
          onContinue={() => navigate('/sequence')}
        />
      )}
    </>
  )
}
