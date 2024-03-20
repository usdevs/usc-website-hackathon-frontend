import { Box, Flex, HStack, VStack, useBoolean, useDisclosure, useToast } from '@chakra-ui/react'
import { endOfDay, endOfMonth, isSameDay, startOfDay, startOfMonth } from 'date-fns'
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval'
import { NextPage } from 'next'
import { FC, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { NumberToStringJSObject } from '@/types/auth.types'
import {
  BookingDataBackend,
  BookingDataDisplay,
  BookingDataSelection,
  Venue,
} from '@/types/bookings.types'

import { useAllVenues } from '@/hooks/useAllVenues'
import { useCurrentHalfHourTime } from '@/hooks/useCurrentHalfHourTime'
import { useIdsToColoursMap } from '@/hooks/useIdsToColoursMap'
import { useUserInfo } from '@/hooks/useUserInfo'

import { BookingConfirmationPopup } from '@/components/booking/BookingConfirmationPopup'
import BookingTimesCol from '@/components/booking/BookingTimesCol'
import BookingVenueCol from '@/components/booking/BookingVenueCol'
import Calendar from '@/components/booking/Calendar'
import CalendarEventCard from '@/components/booking/CalendarEventCard'
import Toggle from '@/components/booking/Toggle'
import VenueMenu from '@/components/booking/VenueMenu'

import {
  ALL_VENUES_KEYWORD,
  getFromUrlArrayAndParseJson,
  isUserLoggedIn,
  makeFetchToUrlWithAuth,
  throwsErrorIfNullOrUndefined,
} from '../utils/booking'
import { type ChakraColor, generateChakraColour } from '../utils/colors'

const BookingSelector: FC = () => {
  const [allVenues, isLoadingVenues] = useAllVenues()
  const {
    isOpen: isBookingConfirmationOpen,
    onOpen: onBookingConfirmationOpen,
    onClose: onBookingConfirmationClose,
  } = useDisclosure()
  const [bookingDataFromSelection, setBookingDataFromSelection] = useState<BookingDataSelection>({
    start: new Date(),
    end: new Date(),
    venueId: -1,
  })
  const currentRoundedHalfHourTime = useCurrentHalfHourTime()
  const [userSelectedDate, setUserSelectedDate] = useState<Date>(currentRoundedHalfHourTime)
  const userSelectedMonth = useMemo(() => startOfMonth(userSelectedDate), [userSelectedDate])

  const [authOrNull] = useUserInfo()
  const {
    data: allBookingsInMonthBackend,
    error,
    isLoading: isLoadingBookings,
    mutate,
  } = useSWR<BookingDataBackend[], string[]>(
    [
      process.env.NEXT_PUBLIC_BACKEND_URL || '',
      'bookings/all?start=',
      startOfMonth(userSelectedMonth).toISOString(),
      '&end=',
      endOfMonth(userSelectedMonth).toISOString(),
    ],
    {
      fetcher: getFromUrlArrayAndParseJson,
    },
  )
  const [allBookingsInMonth, setAllBookingsInMonth] = useState<BookingDataDisplay[]>([])
  // we use LocalStorage to persist the colours indefinitely
  const [orgsIdsToColoursMapString, setOrgsIdsToColoursMapString] = useIdsToColoursMap()
  // const orgIdsToColoursMap = useRef<NumberToStringJSObject>({})
  const allBookingsInSelectedDay = useCallback(
    (bookingsToFilterBy: BookingDataDisplay[]) =>
      bookingsToFilterBy.filter((booking) => {
        return isSameDay(booking.from, startOfDay(userSelectedDate))
      }),
    [userSelectedDate],
  )

  useEffect(() => {
    const bookingsEffect = async () => {
      if (isLoadingBookings || !allBookingsInMonthBackend) return

      const bookingsMappedForDisplay: Array<BookingDataDisplay> = allBookingsInMonthBackend.map(
        (booking) => ({
          ...booking,
          from: new Date(booking.start),
          to: new Date(booking.end),
        }),
      )
      setAllBookingsInMonth(bookingsMappedForDisplay)
      const mappedOrgIds: number[] = bookingsMappedForDisplay.map(
        (booking) => booking.bookedForOrgId || booking.bookedBy.org.id,
      )
      const uniqueOrgIds: number[] = [...new Set(mappedOrgIds)]
      const map = orgsIdsToColoursMapString ?? ({} as NumberToStringJSObject)
      const existingColors = new Set(Object.values(map))

      for (const uniqueOrgId of uniqueOrgIds) {
        const hasColor = Object.hasOwn(map, uniqueOrgId)

        if (!hasColor) {
          let id = uniqueOrgId
          let color: ChakraColor
          do {
            color = generateChakraColour(id++)
          } while (existingColors.has(color))

          map[uniqueOrgId] = color
        }
      }

      await setOrgsIdsToColoursMapString(map)
    }
    bookingsEffect()
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedMonth, isLoadingBookings]) // since we call setOrgIdsToColoursMapString, need to remove it from the dependencies
  // array

  // Create time intervals for the current date
  const timeIntervals = useMemo(
    () =>
      eachMinuteOfInterval(
        {
          start: startOfDay(userSelectedDate),
          end: endOfDay(userSelectedDate),
        },
        { step: 30 },
      ),
    [userSelectedDate],
  )

  const venueIndices = useMemo(() => allVenues.map((venue) => venue.id), [allVenues])
  const venueToBookingsMap = new Map<number, BookingDataDisplay[]>(
    venueIndices.map((index) => [index, []]),
  )
  allBookingsInMonth.forEach((booking) => {
    if (!venueToBookingsMap.has(booking.venueId)) {
      throw new Error('Unable to match existing venues in database with venue of booking')
    }
    venueToBookingsMap.get(booking.venueId)!.push(booking)
  })

  const toast = useToast()
  const onModalOpen = () => {
    if (!isUserLoggedIn(authOrNull)) {
      const needToLogin = 'need-to-login'
      if (!toast.isActive(needToLogin)) {
        toast({
          id: needToLogin,
          title: `You need to login to make a booking!`,
          position: 'top',
          duration: 3000,
          status: 'error',
          isClosable: true,
        })
      }
      return
    }
    onBookingConfirmationOpen()
  }

  const [venueIdToFilterBy, setVenueIdToFilterBy] = useState<number>(ALL_VENUES_KEYWORD.id)
  const [isExpandedCalendar, setExpandedCalendar] = useState(false)
  // CALENDAR EVENT CARD
  // Sets the state of the event card
  const [eventCardPos, setEventCardPos] = useState({ x: 0, y: 0 })
  // Sets the content of the event card
  const [bookingCard, setBookingCard] = useState<BookingDataDisplay | undefined>(undefined)

  const startPos = {
    x: -1,
    y: -1,
  }

  const openBookingCard = (event: MouseEvent, booking: BookingDataDisplay | undefined) => {
    event.stopPropagation()
    const el = event.target as HTMLElement
    const box = el.getBoundingClientRect()

    setEventCardPos({ x: box.left - 390, y: box.top })
    setBookingCard(booking)
  }

  const hideEventCard = () => {
    setEventCardPos({ ...startPos })
  }

  //todo check
  // Frontend login for removing the booking from bookingsSortedByVenue
  // May have to change bookingsSortedByVenue to state to update it
  // We want the booking to be removed from the grid immediately
  // Regardless of whether the delete request is successful
  // If it is unsuccessful, we can just add it back to bookingsSortedByVenue
  const [isDeleting, setIsDeleting] = useBoolean()

  const handleDeleteBooking = async (bookingId: number) => {
    setIsDeleting.on()

    const { token } = throwsErrorIfNullOrUndefined(authOrNull)

    try {
      await makeFetchToUrlWithAuth(
        process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings/' + bookingId,
        token,
        'DELETE',
      )
      toast({
        id: 'booking-deleted-successfully',
        title: 'Booking deleted successfully',
        position: 'top',
        duration: 3000,
        status: 'success',
        isClosable: true,
      })
      await mutate(undefined)
      hideEventCard()
    } catch (err) {
      const message = (err as Error).message
      toast({
        id: 'booking-deleted-error',
        title: message,
        position: 'top',
        duration: 3000,
        status: 'error',
        isClosable: true,
      })
    } finally {
      setIsDeleting.off()
    }
  }

  const isDataFetching = useCallback(() => {
    return isLoadingVenues || isLoadingBookings
  }, [isLoadingBookings, isLoadingVenues])

  if (error) {
    throw new Error('Unable to fetch bookings from backend')
  }

  if (isDataFetching()) {
    return <></>
  }

  console.log('Is rendering')

  return (
    <Box>
      {/* Put absolutely positioned elements here as they still cause slight
      layout shifts for some reason */}
      {eventCardPos.x !== -1 && (
        <CalendarEventCard
          x={eventCardPos.x}
          y={eventCardPos.y}
          booking={bookingCard}
          onDelete={handleDeleteBooking}
          isDeleting={isDeleting}
        />
      )}

      {/* Booking form */}
      <BookingConfirmationPopup
        isOpen={isBookingConfirmationOpen}
        onClose={onBookingConfirmationClose}
        startDate={userSelectedDate}
        bookingDataFromSelection={bookingDataFromSelection}
        mutate={mutate}
      />

      <HStack alignItems='start' py={4} px={2} gap='2' onClick={hideEventCard}>
        {/* Sidebar calendar */}
        <VStack alignItems={'start'} position='sticky' top='8'>
          <HStack gap='4'>
            <VenueMenu
              venues={allVenues}
              venueIdToFilterBy={venueIdToFilterBy}
              setVenueIdToFilterBy={setVenueIdToFilterBy}
            />
            <Toggle isOn={isExpandedCalendar} setIsOn={setExpandedCalendar} />
          </HStack>
          <Calendar
            isOn={isExpandedCalendar}
            setIsOn={setExpandedCalendar}
            setStartDate={setUserSelectedDate}
            bookings={
              venueIdToFilterBy === ALL_VENUES_KEYWORD.id
                ? allBookingsInMonth
                : venueToBookingsMap.get(venueIdToFilterBy) || []
            }
          />
        </VStack>

        <HStack overflowX='auto' hidden={isExpandedCalendar}>
          <BookingTimesCol />
          <HStack>
            {allVenues
              .filter((venue) => {
                if (venueIdToFilterBy === ALL_VENUES_KEYWORD.id) {
                  return true
                }
                return venue.id === venueIdToFilterBy
              })
              .map((venue: Venue) => {
                return (
                  <BookingVenueCol
                    orgIdsToColoursMap={orgsIdsToColoursMapString || {}}
                    timeIntervals={timeIntervals}
                    key={venue.id}
                    venueName={venue.name}
                    openBookingModal={(start, end) => {
                      setBookingDataFromSelection({
                        venueId: venue.id,
                        start,
                        end,
                      })
                      onModalOpen()
                    }}
                    currentVenueBookings={allBookingsInSelectedDay(
                      venueToBookingsMap.get(venue.id) || [],
                    )}
                    openBookingCard={openBookingCard}
                  />
                )
              })}
          </HStack>
        </HStack>
      </HStack>
    </Box>
  )
}

const Grid: NextPage = () => {
  return (
    <Flex justify='center' flexDir='column' as='main'>
      <BookingSelector />
    </Flex>
  )
}

export default Grid
