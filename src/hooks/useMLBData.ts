import { useQuery } from '@tanstack/react-query'
import { getMLBGameData, type MLBGameData } from '../services/mlbStatsService'

const DEFAULT_REFRESH_INTERVAL = 60_000

export interface UseMLBDataResult {
  data: MLBGameData | undefined
  isLoading: boolean
  isError: boolean
  isSampleData: boolean
}

export function useMLBData(refreshInterval = DEFAULT_REFRESH_INTERVAL): UseMLBDataResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['mlbGameData'],
    queryFn: ({ signal }) => getMLBGameData(signal),
    refetchInterval: refreshInterval,
  })

  return {
    data: data?.data,
    isLoading,
    isError,
    isSampleData: data?.isSampleData ?? false,
  }
}
