import { useState } from 'react'

export function CongratsScreen() {
  const [inputValue, setInputValue] = useState('')
  const [playerName, setPlayerName] = useState('This Fan')
  const [showModal, setShowModal] = useState(true)

  function handleSubmit() {
    setPlayerName(inputValue.trim() || 'This Fan')
    setShowModal(false)
  }

  function handleShare() {
    navigator
      .share({
        title: 'Scorecard Recovery Crew',
        text: `${playerName} is an official member of the Scorecard Recovery Crew! "A Philly by any other name would smell as sweet."`,
      })
      .catch(() => {})
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 text-center">
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="phanatic-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <div className="mx-6 rounded-2xl bg-white p-8 text-center shadow-xl">
            <h2 id="phanatic-modal-title" className="mb-4 text-2xl font-bold">
              A Message from the Phanatic
            </h2>
            <p className="mb-6 text-gray-700">
              The Phanatic wants to thank you for helping him recover the scorecard. As a token of
              his gratitude, he'd like to make you an official member of the Scorecard Recovery
              Crew.
            </p>
            <label htmlFor="player-name" className="mb-1 block text-sm font-medium text-gray-600">
              Your name
            </label>
            <input
              id="player-name"
              type="text"
              autoFocus
              value={inputValue}
              placeholder="Enter your name (optional)"
              className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="w-full rounded-xl bg-red-600 px-8 py-3 font-bold text-white active:bg-red-700"
              onClick={handleSubmit}
            >
              Join the Crew
            </button>
          </div>
        </div>
      )}

      <img
        src="/peteRose.jpg"
        alt="The recovered scorecard"
        className="mb-6 w-full max-w-sm rounded-xl"
      />

      <div className="w-full max-w-sm rounded-xl border-4 border-double border-red-600 bg-white p-6 shadow-lg">
        <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">This certifies that</p>
        <p className="mb-2 text-2xl font-bold text-red-700">{playerName}</p>
        <p className="text-sm uppercase tracking-widest text-gray-500">is an official member of the</p>
        <p className="mt-1 text-lg font-bold">Scorecard Recovery Crew</p>
      </div>

      <p className="mt-6 text-sm italic text-gray-500">
        "A Philly by any other name would smell as sweet."
      </p>

      {typeof navigator.share === 'function' && (
        <button
          className="mt-6 rounded-xl bg-red-600 px-8 py-3 font-bold text-white active:bg-red-700"
          onClick={handleShare}
        >
          Share your achievement
        </button>
      )}
    </div>
  )
}
