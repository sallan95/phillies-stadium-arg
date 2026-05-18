const MLB_API_BASE = 'https://statsapi.mlb.com/api'
const PHILLIES_TEAM_ID = 143

export interface MLBPlayer {
  fullName: string
  primaryPosition: { abbreviation: string }
  jerseyNumber?: string
}

export interface MLBGameData {
  gamePk: number
  battingOrder: number[]
  pitchers: number[]
  players: Record<string, MLBPlayer>
}

export interface MLBDataResult {
  data: MLBGameData
  isSampleData: boolean
}

export const FALLBACK_DATA: MLBGameData = {
  gamePk: 0,
  battingOrder: [663728, 608369, 547180, 571771, 592518, 641355, 596019, 622766, 554430],
  pitchers: [554430],
  players: {
    ID663728: { fullName: 'Kyle Schwarber', primaryPosition: { abbreviation: 'LF' } },
    ID608369: { fullName: 'Trea Turner', primaryPosition: { abbreviation: 'SS' } },
    ID547180: { fullName: 'Bryce Harper', primaryPosition: { abbreviation: '1B' } },
    ID571771: { fullName: 'Nick Castellanos', primaryPosition: { abbreviation: 'RF' } },
    ID592518: { fullName: 'J.T. Realmuto', primaryPosition: { abbreviation: 'C' } },
    ID641355: { fullName: 'Alec Bohm', primaryPosition: { abbreviation: '3B' } },
    ID596019: { fullName: 'Brandon Marsh', primaryPosition: { abbreviation: 'CF' } },
    ID622766: { fullName: 'Bryson Stott', primaryPosition: { abbreviation: '2B' } },
    ID554430: { fullName: 'Zack Wheeler', primaryPosition: { abbreviation: 'SP' } },
  },
}

function toLocalDateString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

async function fetchTodayGamePk(date: string, signal?: AbortSignal): Promise<number | null> {
  const url = `${MLB_API_BASE}/v1/schedule?sportId=1&teamId=${PHILLIES_TEAM_ID}&date=${date}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Schedule fetch failed: ${res.status}`)
  const json = await res.json()
  const dates: Array<{ games: Array<{ gamePk: number }> }> = json.dates ?? []
  return dates[0]?.games[0]?.gamePk ?? null
}

async function fetchRecentGamePk(signal?: AbortSignal): Promise<number | null> {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - 14)
  const startDate = toLocalDateString(start)
  const endDate = toLocalDateString(today)
  const url = `${MLB_API_BASE}/v1/schedule?sportId=1&teamId=${PHILLIES_TEAM_ID}&startDate=${startDate}&endDate=${endDate}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Schedule fetch failed: ${res.status}`)
  const json = await res.json()
  const dates: Array<{ games: Array<{ gamePk: number }> }> = json.dates ?? []
  if (dates.length === 0) return null
  return dates[dates.length - 1].games[0]?.gamePk ?? null
}

async function fetchLiveFeed(gamePk: number, signal?: AbortSignal): Promise<MLBGameData> {
  const url = `${MLB_API_BASE}/v1.1/game/${gamePk}/feed/live`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Live feed fetch failed: ${res.status}`)
  const json = await res.json()
  // Phillies may be home or away — read the correct team's lineup so the data
  // is accurate regardless of venue (not just Citizens Bank Park).
  const isPhilliesHome = json.gameData?.teams?.home?.id === PHILLIES_TEAM_ID
  const teamKey = isPhilliesHome ? 'home' : 'away'
  const team = json.liveData?.boxscore?.teams?.[teamKey] ?? {}
  return {
    gamePk,
    battingOrder: team.battingOrder ?? [],
    pitchers: team.pitchers ?? [],
    players: json.gameData?.players ?? {},
  }
}

// Non-abort errors are swallowed and resolved as FALLBACK_DATA (isSampleData: true)
// per the AC: "API errors fall back to sample data silently." Only AbortErrors are
// re-thrown so TanStack Query can cancel in-flight requests on unmount.
export async function getMLBGameData(signal?: AbortSignal): Promise<MLBDataResult> {
  try {
    const today = toLocalDateString(new Date())
    let gamePk = await fetchTodayGamePk(today, signal)
    if (gamePk === null) {
      gamePk = await fetchRecentGamePk(signal)
    }
    if (gamePk === null) {
      return { data: FALLBACK_DATA, isSampleData: true }
    }
    const data = await fetchLiveFeed(gamePk, signal)
    return { data, isSampleData: false }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err
    return { data: FALLBACK_DATA, isSampleData: true }
  }
}
