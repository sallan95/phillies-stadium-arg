import type { ComponentType } from 'react'
import type { GameProps } from '../games/types'

export interface GameConfig {
  gameId: string
  pieceId: string
  displayName: string
  description: string
  component: ComponentType<GameProps>
}

// Screens are imported lazily to keep this file free of circular deps.
// Add a new entry here to register a game — nothing else needs to change.
import { StadiumQuiz } from '../games/stadium-quiz/StadiumQuiz'

export const GAMES: GameConfig[] = [
  {
    gameId: 'stadium-quiz',
    pieceId: 'piece-1',
    displayName: 'Eyes Open',
    description: 'The Phanatic thinks the clues are hidden in plain sight. Look around!',
    component: StadiumQuiz,
  },
]
