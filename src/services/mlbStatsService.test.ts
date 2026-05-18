import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMLBGameData, FALLBACK_DATA } from './mlbStatsService'

const mockScheduleWithGame = {
  dates: [{ games: [{ gamePk: 123456 }] }],
}

const mockScheduleEmpty = { dates: [] }

const mockLiveFeed = {
  liveData: {
    boxscore: {
      teams: {
        home: {
          battingOrder: [663728, 608369, 547180],
          pitchers: [554430],
        },
      },
    },
  },
  gameData: {
    teams: { home: { id: 143 }, away: { id: 111 } },
    players: {
      ID663728: { fullName: 'Kyle Schwarber', primaryPosition: { abbreviation: 'LF' } },
      ID554430: { fullName: 'Zack Wheeler', primaryPosition: { abbreviation: 'SP' } },
    },
  },
}

const mockLiveFeedPhilliesAway = {
  liveData: {
    boxscore: {
      teams: {
        home: { battingOrder: [999, 998, 997], pitchers: [996] },
        away: { battingOrder: [663728, 608369, 547180], pitchers: [554430] },
      },
    },
  },
  gameData: {
    teams: { home: { id: 111 }, away: { id: 143 } },
    players: {
      ID663728: { fullName: 'Kyle Schwarber', primaryPosition: { abbreviation: 'LF' } },
      ID554430: { fullName: 'Zack Wheeler', primaryPosition: { abbreviation: 'SP' } },
    },
  },
}

function mockFetch(responses: Array<{ ok: boolean; body: unknown }>) {
  let call = 0
  return vi.fn().mockImplementation(() => {
    const response = responses[call++] ?? responses[responses.length - 1]
    return Promise.resolve({
      ok: response.ok,
      status: response.ok ? 200 : 500,
      json: () => Promise.resolve(response.body),
    })
  })
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe('getMLBGameData', () => {
  it('fetches live feed when a game is scheduled today', async () => {
    vi.stubGlobal('fetch', mockFetch([
      { ok: true, body: mockScheduleWithGame },
      { ok: true, body: mockLiveFeed },
    ]))

    const result = await getMLBGameData()

    expect(result.isSampleData).toBe(false)
    expect(result.data.gamePk).toBe(123456)
    expect(result.data.battingOrder).toEqual([663728, 608369, 547180])
    expect(result.data.pitchers).toEqual([554430])
  })

  it('falls back to most recent game when no game today', async () => {
    const recentSchedule = { dates: [{ games: [{ gamePk: 999 }] }] }
    vi.stubGlobal('fetch', mockFetch([
      { ok: true, body: mockScheduleEmpty },
      { ok: true, body: recentSchedule },
      { ok: true, body: mockLiveFeed },
    ]))

    const result = await getMLBGameData()

    expect(result.isSampleData).toBe(false)
    expect(result.data.gamePk).toBe(999)
  })

  it('reads away team data when Phillies are the away team', async () => {
    vi.stubGlobal('fetch', mockFetch([
      { ok: true, body: mockScheduleWithGame },
      { ok: true, body: mockLiveFeedPhilliesAway },
    ]))

    const result = await getMLBGameData()

    expect(result.isSampleData).toBe(false)
    expect(result.data.battingOrder).toEqual([663728, 608369, 547180])
    expect(result.data.pitchers).toEqual([554430])
  })

  it('returns sample data when schedule fetch returns non-2xx', async () => {
    vi.stubGlobal('fetch', mockFetch([{ ok: false, body: null }]))

    const result = await getMLBGameData()

    expect(result.isSampleData).toBe(true)
    expect(result.data).toEqual(FALLBACK_DATA)
  })

  it('returns sample data when fetch throws a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    const result = await getMLBGameData()

    expect(result.isSampleData).toBe(true)
    expect(result.data).toEqual(FALLBACK_DATA)
  })

  it('returns sample data when live feed fetch fails', async () => {
    vi.stubGlobal('fetch', mockFetch([
      { ok: true, body: mockScheduleWithGame },
      { ok: false, body: null },
    ]))

    const result = await getMLBGameData()

    expect(result.isSampleData).toBe(true)
    expect(result.data).toEqual(FALLBACK_DATA)
  })

  it('returns sample data when no games found in lookback window', async () => {
    vi.stubGlobal('fetch', mockFetch([
      { ok: true, body: mockScheduleEmpty },
      { ok: true, body: mockScheduleEmpty },
    ]))

    const result = await getMLBGameData()

    expect(result.isSampleData).toBe(true)
    expect(result.data).toEqual(FALLBACK_DATA)
  })
})
