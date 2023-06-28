import useSWRImmutable from 'swr/immutable'
import { fetchFromUrlAndParseJson } from '../utils'

export const useAllVenues = (): [Venue[], boolean] => {
  const { data, error, isLoading } = useSWRImmutable<Venue[], string>(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'venues',
    fetchFromUrlAndParseJson,
  )
  if (data === undefined) {
    return [[], false]
  } else if (error) {
    throw new Error('Unable to fetch venues from backend')
  }
  return [data, isLoading]
}
