import { getMinutes, setMinutes } from 'date-fns'
import { useEffect, useState } from 'react'

const convertMinutesToMilliseconds = (min: number) => min * 1000 * 60 * 30

const getTime = () => {
  return new Date()
}

export const useCurrentHalfHourTime = () => {
  const currentTime = getTime()
  const roundedMinutes = getMinutes(currentTime) >= 30 ? 30 : 0
  const roundedTime = setMinutes(currentTime, roundedMinutes)
  const [currentRoundedTime, setCurrentRoundedTime] = useState<Date>(roundedTime)

  useEffect(() => {
    const minutes = getMinutes(currentRoundedTime)
    const timeToRefresh = minutes >= 30 ? 60 - minutes : 30 - minutes
    const intervalId = setInterval(
      () => setCurrentRoundedTime(getTime()),
      convertMinutesToMilliseconds(timeToRefresh),
    )
    return () => clearInterval(intervalId)
  }, [currentRoundedTime, setCurrentRoundedTime])

  return currentRoundedTime
}
