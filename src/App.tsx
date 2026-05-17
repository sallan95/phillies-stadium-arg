import { useState } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import { IntroScreen } from './screens/IntroScreen'
import { SequenceScreen } from './screens/SequenceScreen'
import { CongratsScreen } from './screens/CongratsScreen'
import { PieceFoundCelebration } from './components/PieceFoundCelebration'
import { GAMES } from './config/games'
import { useProgress } from './hooks/useProgress'

export function App() {
  const { progress } = useProgress()

  const defaultRoute = (() => {
    if (progress.gameComplete) return '/congrats'
    if (progress.completedGames.length > 0) return '/sequence'
    return '/'
  })()

  return (
    <Routes>
      <Route path="/" element={
        progress.completedGames.length > 0
          ? <Navigate to={defaultRoute} replace />
          : <IntroScreen />
      } />
      <Route path="/sequence" element={<SequenceScreen />} />
      <Route path="/congrats" element={
        progress.gameComplete
          ? <CongratsScreen />
          : <Navigate to="/" replace />
      } />
      <Route path="/game/:gameId" element={<GameRoute />} />
      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
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
