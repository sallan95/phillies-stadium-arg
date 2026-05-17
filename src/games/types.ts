export interface GameProps {
  gameId: string
  onComplete: (pieceId: string) => void
}

export interface Question {
  question: string
  options: string[]
  correctAnswer: string
  hint: string
}
