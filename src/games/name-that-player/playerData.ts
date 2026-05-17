export const PIECE_ID = 'piece-2'

export interface PlayerQuestion {
  question: string
  options: string[]
  correctAnswer: string
  hint: string
}

export const QUESTIONS: PlayerQuestion[] = [
  {
    question: "Who is the Phillies' ace starting pitcher?",
    options: ['Zack Wheeler', 'Aaron Nola', 'Ranger Suárez', 'Cristopher Sánchez'],
    correctAnswer: 'Zack Wheeler',
    hint: 'The starting pitcher throws the first pitch — they lead the rotation!',
  },
  {
    // TODO: fetch live lineup from MLB Stats API (US8 post-MVP) — Harper's actual slot varies game to game
    question: 'Who bats cleanup for the Phillies?',
    options: ['Bryce Harper', 'Kyle Schwarber', 'Trea Turner', 'Nick Castellanos'],
    correctAnswer: 'Bryce Harper',
    hint: 'The cleanup hitter bats 4th in the lineup — check the scoreboard!',
  },
  {
    question: 'Who is the most energetic member of the Phillies organization?',
    options: ['Phillies Phanatic', 'J.T. Realmuto', 'Alec Bohm', 'Johan Rojas'],
    correctAnswer: 'Phillies Phanatic',
    hint: "He's not on the 26-man roster, but he's never missed a home game!",
  },
]
