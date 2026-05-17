export interface PieceFoundCelebrationProps {
  pieceId: string
  pieceNumber: number
  onContinue: () => void
}

export function PieceFoundCelebration({ pieceNumber, onContinue }: PieceFoundCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-8 text-center">
        {/* Replace with actual piece image when jigsaw assets are delivered */}
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-xl bg-red-50 text-6xl">
          🏆
        </div>

        <h2 className="mb-3 text-2xl font-bold">You found it!</h2>
        <p className="mb-8 text-gray-600">
          The Phanatic does a little dance — you found piece {pieceNumber}!
        </p>

        <button
          className="w-full rounded-xl bg-red-600 px-5 py-4 text-lg font-bold text-white active:bg-red-700"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
