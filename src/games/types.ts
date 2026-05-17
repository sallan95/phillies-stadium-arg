export interface GameProps {
  gameId: string
  onComplete: (pieceId: string) => void
}
