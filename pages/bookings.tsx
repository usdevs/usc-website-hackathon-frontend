import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import {
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useBoolean,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval'
import { BookingConfirmationPopup } from '../components/booking/BookingConfirmationPopup'
import { NextPage } from 'next'
import Calendar from '../components/booking/Calendar'
import { ChevronDownIcon } from '@chakra-ui/icons'
import BookingsTimesCol from '../components/booking/BookingTimesCol'
import BookingVenueCol from '../components/booking/BookingVenueCol'
import Toggle from '../components/booking/Toggle'
import CalendarEventCard from '../components/booking/CalendarEventCard'
import {
  ALL_VENUES_KEYWORD,
  getFromUrlArrayAndParseJson,
  getVenueFromId,
  isUserLoggedIn,
  makeFetchToUrlWithAuth,
  throwsErrorIfNullOrUndefined,
} from '../utils'
import { useCurrentHalfHourTime } from '../hooks/useCurrentHalfHourTime'
import { endOfMonth, isSameDay, startOfMonth } from 'date-fns'
import { useUserInfo } from '../hooks/useUserInfo'
import { useIdsToColoursMap } from '../hooks/useIdsToColoursMap'
import { useAllVenues } from '../hooks/useAllVenues'
import useSWR from 'swr'
import { getOnlyMonthAndYearFromDate, getOnlyDayMonthAndYearFromDate } from '../utils/dates'
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
  const [userSelectedMonth, setUserSelectedMonth] = useState<Date>(startOfMonth(userSelectedDate))
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
    getFromUrlArrayAndParseJson,
  )
  const toast = useToast()
  const toast_id = 'auth-toast'
  const [allBookingsInMonth, setAllBookingsInMonth] = useState<BookingDataDisplay[]>([])
  // we use LocalStorage to persist the colours indefinitely
  const [orgsIdsToColoursMapString, setOrgsIdsToColoursMapString] = useIdsToColoursMap()
  // const orgIdsToColoursMap = useRef<NumberToStringJSObject>({})

  const startOfDay = getOnlyDayMonthAndYearFromDate(userSelectedDate)
  const allBookingsInSelectedDay = (bookingsToFilterBy: BookingDataDisplay[]) =>
    bookingsToFilterBy.filter((booking) => {
      return isSameDay(booking.from, startOfDay)
    })

  useEffect(() => {
    const newPossibleMonth = getOnlyMonthAndYearFromDate(userSelectedDate)
    if (newPossibleMonth.getTime() !== userSelectedMonth.getTime()) {
      setUserSelectedMonth(newPossibleMonth)
    }
    // we can disable eslint here because this is the only place where userSelectedMonth is set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedDate])

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
      let uniqueOrgIds: number[] = [...new Set(mappedOrgIds)]
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
  const timeIntervals = (() => {
    const year = userSelectedDate.getFullYear()
    const month = userSelectedDate.getMonth()
    const day = userSelectedDate.getDate()
    return eachMinuteOfInterval(
      {
        start: new Date(year, month, day, 0),
        end: new Date(year, month, day, 23, 59),
      },
      { step: 30 },
    )
  })()

  type sorted = {
    bookings: Array<BookingDataDisplay>
    venueId: number
  }

  const venueIndices = allVenues.map((venue) => venue.id)
  // TODO cleanup this stuff, refactor this component
  const bookingsSortedByVenue: Array<sorted> = venueIndices.map((index) => {
    return { bookings: [], venueId: index }
  })
  // Filter bookings to only show bookings for the current day and the current venue
  allBookingsInMonth.reduce(function (memo, x) {
    throwsErrorIfNullOrUndefined(
      memo.find((y) => y.venueId === x.venueId),
      'Unable to match existing venues in database with venue of booking',
    ).bookings.push(x)
    return memo
  }, bookingsSortedByVenue)

  const onModalOpen = () => {
    if (!isUserLoggedIn(authOrNull)) {
      if (!toast.isActive(toast_id)) {
        toast({
          id: toast_id,
          title: `You need to login to make a booking!`,
          position: 'top',
          duration: 3000,
          status: 'error',
          isClosable: true,
        })
      }
    } else {
      onBookingConfirmationOpen()
    }
  }

  const [venueIdToFilterBy, setVenueIdToFilterBy] = useState<number>(ALL_VENUES_KEYWORD.id)
  const [isExpandedCalendar, setExpandedCalendar] = useState(false)
  // CALENDAR EVENT CARD
  // Sets the state of the event card
  const [eventCardPos, setEventCardPos] = useState({ x: 0, y: 0 })
  // Sets the content of the event card
  const [bookingCard, setBookingCard] = useState<BookingDataDisplay | undefined>(undefined)
  const { scrollY } = useScroll()

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

  useMotionValueEvent(scrollY, 'change', () => {
    // Prevent re-render
    if (eventCardPos.x !== startPos.x) {
      hideEventCard()
    }
  })

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
    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings/' + bookingId,
      token,
      'DELETE',
    )

    if (responseStatus === 200) {
      toast({
        id: toast_id,
        title: 'Booking deleted successfully',
        position: 'top',
        duration: 3000,
        status: 'success',
        isClosable: true,
      })
      await mutate(undefined)
      hideEventCard()
    } else {
      toast({
        id: toast_id,
        title: responseJson.message,
        position: 'top',
        duration: 3000,
        status: 'error',
        isClosable: true,
      })
    }
    setIsDeleting.off()
  }

  const intervalRef = useRef<number>(-1)

  const isDataFetching = useCallback(() => {
    return isLoadingVenues || isLoadingBookings
  }, [isLoadingBookings, isLoadingVenues])

  useEffect(() => {
    const handleScroll = () => {
      if (isDataFetching()) {
        return
      }
      intervalRef.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isDataFetching])

  useEffect(() => {
    const scrollToPopularTimes = () => {
      window.scrollTo({
        top:
          intervalRef.current === -1
            ? document.documentElement.clientHeight * 1.3
            : intervalRef.current,
        behavior: 'smooth',
      })
    }
    scrollToPopularTimes()
  })

  if (error) {
    throw new Error('Unable to fetch bookings from backend')
  }

  if (isDataFetching()) {
    return <></>
  }

  console.log('Is re-rendering')

  return (
    <>
      {/* Put absolutely positioned elements here as they still cause slight
      layout shifts for some reason */}
      <AnimatePresence>
        {eventCardPos.x !== -1 && (
          <CalendarEventCard
            x={eventCardPos.x}
            y={eventCardPos.y}
            booking={bookingCard}
            onDelete={handleDeleteBooking}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
      {authOrNull ? (
        <BookingConfirmationPopup
          isOpen={isBookingConfirmationOpen}
          onClose={onBookingConfirmationClose}
          startDate={userSelectedDate}
          bookingDataFromSelection={bookingDataFromSelection}
          mutate={mutate}
        />
      ) : (
        <></>
      )}
      <HStack alignItems='start' py={4} gap='2' onClick={hideEventCard}>
        <VStack px={12} alignItems={'start'} position='sticky' top='20px'>
          <HStack gap='4'>
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} colorScheme='blue' rightIcon={<ChevronDownIcon />} w='200px'>
                {venueIdToFilterBy === 0
                  ? 'Venue'
                  : getVenueFromId(allVenues, venueIdToFilterBy).name}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup defaultValue={ALL_VENUES_KEYWORD.name} type='radio'>
                  {[ALL_VENUES_KEYWORD, ...allVenues].map((venue) => (
                    <MenuItemOption
                      onClick={() => setVenueIdToFilterBy(venue.id)}
                      key={venue.id}
                      value={venue.name}
                    >
                      {venue.name}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Toggle isOn={isExpandedCalendar} setIsOn={setExpandedCalendar} />
          </HStack>
          <Calendar
            isOn={isExpandedCalendar}
            setIsOn={setExpandedCalendar}
            setStartDate={setUserSelectedDate}
            bookings={
              venueIdToFilterBy === ALL_VENUES_KEYWORD.id
                ? allBookingsInMonth
                : throwsErrorIfNullOrUndefined(
                    bookingsSortedByVenue.find((x) => x.venueId === venueIdToFilterBy),
                  ).bookings
            }
          />
        </VStack>
        <AnimatePresence>
          {!isExpandedCalendar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HStack overflowX='auto' maxW='calc(100vw - 540px)' maxH='90vh'>
                <BookingsTimesCol />
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
                            throwsErrorIfNullOrUndefined(
                              bookingsSortedByVenue.find((x) => x.venueId === venue.id),
                            ).bookings,
                          )}
                          openBookingCard={openBookingCard}
                        />
                      )
                    })}
                </HStack>
              </HStack>
            </motion.div>
          )}
        </AnimatePresence>
      </HStack>
    </>
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
