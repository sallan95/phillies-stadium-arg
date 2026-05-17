import type { ComponentType } from 'react'
import type { GameProps } from '../games/types'

export interface GameConfig {
  gameId: string
  pieceId: string
  displayName: string
  description: string
  component: ComponentType<GameProps>
}

// Add a new entry here to register a game — nothing else needs to change.
import { StadiumQuiz } from '../games/stadium-quiz/StadiumQuiz'
import { MascotFriends } from '../games/mascot-friends/MascotFriends'

export const GAMES: GameConfig[] = [
  {
    gameId: 'stadium-quiz',
    pieceId: 'piece-1',
    displayName: 'Eyes Open',
    description: 'The Phanatic thinks the clues are hidden in plain sight. Look around!',
    component: StadiumQuiz,
  },
  // piece-2 is awarded by the Name That Player quiz (US8), not yet built
  {
    gameId: 'mascot-friends',
    pieceId: 'piece-3',
    displayName: "The Phanatic's Crew",
    description: 'The Phanatic has friends all over the league. Can you spot them?',
    component: MascotFriends,
  },
]
