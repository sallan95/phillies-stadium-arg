import { JigsawPuzzle as JigsawPuzzleLib } from 'react-jigsaw-puzzle/lib/jigsaw-puzzle'
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css'

interface JigsawPuzzleProps {
  imageSrc: string
  rows?: number
  columns?: number
  onComplete: () => void
}

export function JigsawPuzzle({ imageSrc, rows = 3, columns = 2, onComplete }: JigsawPuzzleProps) {
  return (
    <JigsawPuzzleLib
      imageSrc={imageSrc}
      rows={rows}
      columns={columns}
      onSolved={onComplete}
    />
  )
}
