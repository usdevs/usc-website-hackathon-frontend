import { useState, useEffect, FC, MouseEvent, useContext } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import {
  HStack,
  VStack,
  Flex,
  useToast,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Button,
  MenuOptionGroup,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval'
import { BookingConfirmationPopup } from '../components/booking/BookingConfirmationPopup'
import { BookingsContext, BookingsContextValue } from '../context/BookingsContext'
import Footer from '../components/Footer'
import { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import Calendar from '../components/booking/Calendar'
import { ChevronDownIcon } from '@chakra-ui/icons'
import BookingsTimesCol from '../components/booking/BookingTimesCol'
import BookingVenueCol from '../components/booking/BookingVenueCol'
import Toggle from '../components/booking/Toggle'
import CalendarEventCard from '../components/booking/CalendarEventCard'
import {
  ALL_VENUES_KEYWORD,
  throwsErrorIfNullOrUndefined,
  isUserLoggedIn,
  useBookingCellStyles,
} from '../utils'
import { useCurrentHalfHourTime } from '../hooks/useCurrentHalfHourTime'
import { addDays, isSameDay } from 'date-fns'
import { useUserInfo } from '../hooks/useUserInfo'
import { useIdsToColoursMap } from '../hooks/useIdsToColoursMap'

const getOnlyMonthAndYearFromDate = (dateToParse: Date) => {
  const month = dateToParse.getMonth()
  const year = dateToParse.getFullYear()
  return new Date(year, month)
}

const getOnlyDayMonthAndYearFromDate = (dateToParse: Date) => {
  const dateWithMonthAndYear = getOnlyMonthAndYearFromDate(dateToParse)
  const date = dateToParse.getDate()
  dateWithMonthAndYear.setDate(date)
  return dateWithMonthAndYear
}

const BookingSelector: FC = () => {
  const [_, setRootFontSize] = useBookingCellStyles()
  useEffect(() => {
    ;(async () => {
      const browserRootFontSize = window.getComputedStyle(document.documentElement).fontSize
      await setRootFontSize(Number(browserRootFontSize.replace('px', '')))
    })()
    const scrollToPopularTimes = () => {
      window.scrollTo({
        top: document.documentElement.clientHeight * 1.3,
        behavior: 'smooth',
      })
    }
    scrollToPopularTimes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bookingDataFromSelection, setBookingDataFromSelection] = useState<BookingDataSelection>({
    start: null,
    end: null,
    venueId: -1,
  })
  const [unsuccessfulFormSubmitString, setUnsuccessfulFormSubmitString] = useState<string>('')
  const bookingsContextValue: BookingsContextValue = useContext(BookingsContext)
  const VENUES: Venue[] = bookingsContextValue.allVenues
  const currentRoundedHalfHourTime = useCurrentHalfHourTime()
  const [userSelectedDate, setUserSelectedDate] = useState<Date>(currentRoundedHalfHourTime)
  const [userSelectedMonth, setUserSelectedMonth] = useState<Date>(
    getOnlyMonthAndYearFromDate(userSelectedDate),
  )
  //todo this is a silly way to update
  const [isBackendUpdated, setIsBackendUpdated] = useState<boolean>(false)
  const [auth] = useUserInfo()
  //TODO this state shouldn't be here
  const [bookingData, setBookingData] = useState<BookingDataForm>({
    eventName: '',
    orgId: auth ? auth.orgIds[0] : -1,
  })
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
    ;(async () => {
      const endOfMonth = addDays(userSelectedMonth, 31)
      const currentBookings = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL +
          'bookings/all?start=' +
          userSelectedMonth.toISOString() +
          '&end=' +
          endOfMonth.toISOString(),
      )
      const allBookingsInMonthBackend: BookingDataBackend[] = await currentBookings.json()
      const bookingsMappedForDisplay: Array<BookingDataDisplay> = allBookingsInMonthBackend.map(
        (booking) => ({
          ...booking,
          from: new Date(booking.start),
          to: new Date(booking.end),
        }),
      )
      setAllBookingsInMonth(bookingsMappedForDisplay)
      const mappedOrgIds: number[] = bookingsMappedForDisplay.map(
        (booking) => booking.bookedBy.org.id,
      )
      let uniqueOrgIds: number[] = [...new Set(mappedOrgIds)]
      const map =
        orgsIdsToColoursMapString === null ? Object.create(null) : orgsIdsToColoursMapString
      for (const uniqueOrgId of uniqueOrgIds) {
        if (!Object.hasOwn(map, uniqueOrgId)) {
          while (true) {
            let randomColour =
              '#' +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')
            if (Object.values(map).indexOf(randomColour) === -1) {
              map[uniqueOrgId] = randomColour
              break
            }
          }
        }
      }
      await setOrgsIdsToColoursMapString(map)
      // orgIdsToColoursMap.current = map
    })()
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedMonth, isBackendUpdated]) // since we call setOrgIdsToColoursMapString, need to remove it from
  // the dependencies array

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

  const venueIndices = VENUES.map((venue) => venue.id)
  // TODO cleanup this stuff, refactor this component
  const bookingsSortedByVenue: Array<sorted> = venueIndices.map((index) => {
    return { bookings: [], venueId: index }
  })
  // Filter bookings to only show bookings for the current day and the current venue
  allBookingsInMonth.reduce(function (memo, x) {
    throwsErrorIfNullOrUndefined(memo.find((y) => y.venueId === x.venueId)).bookings.push(x)
    return memo
  }, bookingsSortedByVenue)

  const onModalClose = () => {
    setUnsuccessfulFormSubmitString('')
    setBookingData({
      eventName: '',
      orgId: auth ? auth.orgIds[0] : -1,
    })
    onClose()
  }

  const onModalOpen = () => {
    if (!isUserLoggedIn(auth)) {
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
      setBookingData({
        eventName: '',
        orgId: auth ? auth.orgIds[0] : -1,
      })
      onOpen()
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

  const openBookingCard = (event: MouseEvent, booking: BookingDataDisplay | undefined) => {
    event.stopPropagation()
    const el = event.target as HTMLElement
    const box = el.getBoundingClientRect()

    setEventCardPos({ x: box.left - 390, y: box.top })
    setBookingCard(booking)
  }
  const hideEventCard = () => {
    setEventCardPos({ x: -1, y: -1 })
  }

  useMotionValueEvent(scrollY, 'change', () => {
    hideEventCard()
  })

  //todo check
  // Frontend login for removing the booking from bookingsSortedByVenue
  // May have to change bookingsSortedByVenue to state to update it
  // We want the booking to be removed from the grid immediately
  // Regardless of whether the delete request is successful
  // If it is unsuccessful, we can just add it back to bookingsSortedByVenue
  const handleDeleteBooking = async (bookingId: number) => {
    const token = isUserLoggedIn(auth) ? auth?.token : ''
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings/' + bookingId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const res = await response.json()
    if (response.status === 200) {
      toast({
        id: toast_id,
        title: 'Booking deleted successfully',
        position: 'top',
        duration: 3000,
        status: 'success',
        isClosable: true,
      })
      setIsBackendUpdated(!isBackendUpdated)
      hideEventCard()
    } else {
      toast({
        id: toast_id,
        title: res.message,
        position: 'top',
        duration: 3000,
        status: 'error',
        isClosable: true,
      })
    }
  }

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
          />
        )}
      </AnimatePresence>
      {auth ? (
        <BookingConfirmationPopup
          isOpen={isOpen}
          onClose={onModalClose}
          startDate={userSelectedDate}
          setUnsuccessfulFormSubmitString={setUnsuccessfulFormSubmitString}
          unsuccessfulFormSubmitString={unsuccessfulFormSubmitString}
          bookingDataFromSelection={bookingDataFromSelection}
          bookingData={bookingData}
          setBookingData={setBookingData}
          refreshData={() => setIsBackendUpdated(!isBackendUpdated)}
        />
      ) : (
        <></>
      )}
      <HStack alignItems='start' py={4} gap='2' onClick={hideEventCard}>
        <VStack px={12} alignItems={'start'} position='sticky' top='20px'>
          <HStack gap='4'>
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} colorScheme='blue' rightIcon={<ChevronDownIcon />}>
                {venueIdToFilterBy === 0
                  ? 'Venue'
                  : throwsErrorIfNullOrUndefined(VENUES.find((v) => venueIdToFilterBy === v.id))
                      .name}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup defaultValue={ALL_VENUES_KEYWORD.name} type='radio'>
                  {[ALL_VENUES_KEYWORD, ...VENUES].map((venue) => (
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
              <HStack>
                <BookingsTimesCol />
                {VENUES.filter((venue) => {
                  if (venueIdToFilterBy === ALL_VENUES_KEYWORD.id) {
                    return true
                  }
                  return venue.id === venueIdToFilterBy
                }).map((venue: Venue) => {
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
            </motion.div>
          )}
        </AnimatePresence>
      </HStack>
    </>
  )
}

const Grid: NextPage<{ allOrgs: Organisation[]; allVenues: Venue[] }> = ({
  allOrgs,
  allVenues,
}) => {
  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <BookingsContext.Provider value={{ allOrgs, allVenues }}>
        <BookingSelector />
      </BookingsContext.Provider>
      <Footer />
    </Flex>
  )
}

export async function getServerSideProps() {
  const [orgs, venues] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs'),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'venues'),
  ])
  const allOrgs = await (await orgs).json()
  const allVenues = await (await venues).json()
  return { props: { allOrgs, allVenues } }
}

export default Grid
