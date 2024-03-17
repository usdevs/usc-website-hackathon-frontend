import useSWR from 'swr'

import { ObjectWithSetupTime } from '@/types/auth.types'

import { LocalStorageHookResult } from '../types'
import { isServerSide } from '../utils'

/**
 * Gets and sets value to/from local storage.
 *
 * @param key key to get and set value to/from local storage.
 * @param defaultValue default value that is returned incase the key was not found.
 * @param refreshInterval
 * @returns an array of (the saved value, set value function, and remove value function) in the same order.
 */
const useLocalStorageWithTTL = <T extends ObjectWithSetupTime>(
  key: string,
  defaultValue: T | null = null,
  refreshInterval: number,
): LocalStorageHookResult<T> => {
  //todo fix before handover
  //Note that this file is modified to be able to invalidate local storage after 20 minute - see commit
  // b918ac409cedf11db27a11f2df974473d13e4146 for what changed
  const initialValue = defaultValue

  // @ts-ignore
  const fetcher = () => {
    if (!isServerSide()) {
      const storedValue = window.localStorage.getItem(key)
      if (storedValue !== null && storedValue !== 'undefined') {
        const parsedValue = JSON.parse(storedValue)
        if (Date.now() - parsedValue.setupTime <= (refreshInterval + 1) * 60 * 1000) {
          return parsedValue
        } else {
          // invalidate if (refreshInterval + 1) minutes are over
          window.localStorage.removeItem(key)
        }
      }
    }
    return defaultValue
  }

  const { data: value = initialValue, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    refreshInterval: refreshInterval * 60 * 1000, // forces web app to fetch data again once interval is over
  })

  // ========== Set value ==========
  const setValue = async (value: T): Promise<void> => {
    const valueWithSetupTime = { ...value, setupTime: Date.now() }

    await mutate(valueWithSetupTime, false)

    if (isServerSide()) {
      return
    }

    // Save to local storage
    const localStorageValue = JSON.stringify(valueWithSetupTime)
    window.localStorage.setItem(key, localStorageValue)
  }

  // ========== Remove value ==========
  const removeValue = async (): Promise<void> => {
    await mutate(defaultValue, false)

    if (isServerSide()) {
      return
    }

    // Remove value from local storage
    window.localStorage.removeItem(key)
  }

  return [value, setValue, removeValue]
}

export default useLocalStorageWithTTL
