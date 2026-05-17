import { useNavigate } from 'react-router-dom'

export function IntroScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6 text-center">
      {/* Replace with <img src={phanatic} alt="The Phanatic" /> when asset is delivered */}
      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-green-100 text-7xl">
        🐾
      </div>

      <div className="max-w-sm">
        <h1 className="mb-4 text-3xl font-bold">The Phanatic Needs Your Help!</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          Oh no — someone shredded the Phanatic's scorecard and scattered the pieces all over
          Citizens Bank Park! Can you find them all before the final out?
        </p>
      </div>

      <button
        className="w-full max-w-xs rounded-xl bg-red-600 px-8 py-4 text-xl font-bold text-white active:bg-red-700"
        onClick={() => navigate('/sequence')}
      >
        Start the Hunt
      </button>
    </div>
  )
}
