interface SampleDataBadgeProps {
  visible: boolean
}

export function SampleDataBadge({ visible }: SampleDataBadgeProps) {
  if (!visible) return null
  return (
    <div role="status" className="fixed right-2 top-2 rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
      using sample data
    </div>
  )
}
