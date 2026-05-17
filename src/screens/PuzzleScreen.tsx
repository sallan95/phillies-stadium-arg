import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JigsawPuzzle } from '../components/JigsawPuzzle'
import { useProgress } from '../hooks/useProgress'

export function PuzzleScreen() {
  const navigate = useNavigate()
  const { markGameComplete } = useProgress()
  const [showModal, setShowModal] = useState(false)

  function handleContinue() {
    markGameComplete()
    navigate('/congrats')
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-1 text-2xl font-bold">Rebuild the Scorecard</h1>
      <p className="mb-4 text-sm text-gray-500">
        Drag each piece into its spot to complete the Phanatic's scorecard.
      </p>
      <div className="w-full max-w-sm rounded border-2 border-gray-400">
        <JigsawPuzzle imageSrc="/phillies-stadium-arg/peteRose.jpg" onComplete={() => setShowModal(true)} />
      </div>

      {showModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="puzzle-complete-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="mx-6 rounded-2xl bg-white p-8 text-center shadow-xl">
            <h2 id="puzzle-complete-title" className="mb-4 text-3xl font-bold">You did it!</h2>
            <p className="mb-2 text-xl">Welcome to the Scorecard Recovery Crew.</p>
            <button
              className="mt-8 w-full rounded-xl bg-red-600 px-8 py-3 font-bold text-white active:bg-red-700"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
