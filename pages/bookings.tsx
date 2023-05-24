import { useState, useEffect, FC, MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
import { BookingsContext } from '../context/BookingsContext'
import { sub } from 'date-fns'
import Footer from '../components/Footer'
import { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import Calendar from '../components/booking/Calendar'
import { ChevronDownIcon } from '@chakra-ui/icons'
import BookingsTimesCol from '../components/booking/BookingTimesCol'
import BookingVenueCol from '../components/booking/BookingVenueCol'
import Toggle from '../components/booking/Toggle'
import CalendarEventCard from '../components/booking/CalendarEventCard'

import { VENUES } from '../components/booking/CONSTANTS'
import { useUserInfo } from '../utils'

const BOX_HEIGHT = 8 // Ensures time labels are aligned with grid cells

// const testBookings: BookingDataDisplay[] = [
//   {
//     ig: VENUES[1],
//     venueId: 1,
//     userId: 1,
//     from: new Date('2023-03-27T08:30:00+08:00'),
//     to: new Date('2023-03-27T10:00:00+08:00'),
//   },
//   {
//     ig: VENUES[2],
//     venueId: 2,
//     userId: 'Jane Doe',
//     from: new Date('2023-03-27T10:30:00+08:00'),
//     to: new Date('2023-03-27T12:00:00+08:00'),
//   },
//   {
//     ig: VENUES[3],
//     venueId: 5,
//     userId: 'James Smith',
//     from: new Date('2023-03-27T13:00:00+08:00'),
//     to: new Date('2023-03-27T14:30:00+08:00'),
//   },
//   {
//     ig: VENUES[4],
//     venueId: 4,
//     userId: 1,
//     from: new Date('2023-03-27T17:00:00+08:00'),
//     to: new Date('2023-03-27T18:30:00+08:00'),
//   },
// ];

const BookingSelector: FC = () => {
  useEffect(() => {
    const scrollToPopularTimes = () => {
      window.scrollTo({
        top: document.documentElement.clientHeight * 1.3,
        behavior: 'smooth',
      })
    }
    scrollToPopularTimes()
  }, [])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bookingDataFromSelection, setBookingDataFromSelection] = useState<BookingDataSelection>({
    start: null,
    end: null,
    venueId: -1,
    venueName: '',
  })
  const [unsuccessfulFormSubmitString, setUnsuccessfulFormSubmitString] = useState<string>('')
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [isBackendUpdated, setIsBackendUpdated] = useState<boolean>(false)
  const [auth] = useUserInfo()
  const [bookingData, setBookingData] = useState<BookingDataForm>({
    eventName: '',
    orgId: auth ? auth.orgIds[0] : -1,
  })
  const toast = useToast()
  const toast_id = 'auth-toast'
  const [allBookings, setAllBookings] = useState<BookingDataBackend[]>([])

  useEffect(() => {
    ;(async () => {
      const startOfDay = new Date(startDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(startDate)
      endOfDay.setHours(23, 59, 59, 999)
      const currentBookings = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL +
          'bookings/all?start=' +
          startOfDay.toISOString() +
          '&end=' +
          endOfDay,
      )
      const allBookings = await currentBookings.json()
      setAllBookings(allBookings)
    })()
    return () => {}
  }, [startDate, isBackendUpdated])

  // Create time intervals for the current date
  const timeIntervals = (() => {
    const year = startDate.getFullYear()
    const month = startDate.getMonth()
    const day = startDate.getDate()
    return eachMinuteOfInterval(
      {
        start: new Date(year, month, day, 0),
        end: new Date(year, month, day, 23, 59),
      },
      { step: 30 },
    )
  })()

  const venueBookings: Array<Array<BookingDataDisplay>> = new Array(6)
    .fill(0)
    .map(() => new Array(0))
  const bookingsMappedForDisplay: Array<BookingDataDisplay> = allBookings.map((booking) => ({
    ...booking,
    // Subtract 1 minute to the start time to properly display the booking
    from: sub(Date.parse(booking.start), { minutes: 1 }),
    to: new Date(booking.end),
  }))
  // Convert the bookings from the backend into a format that can be used by the grid
  // Filter bookings to only show bookings for the current day and the current venue
  // TODO fix, this is broken for some strange reason cuz of the +8; we do not need it anyways because we specify
  //  start and end to backend now, but good to have
  // .filter((booking) => isSameDay(booking.to, timeIntervals[0]))
  bookingsMappedForDisplay.reduce(function (memo, x) {
    memo[x['venueId'] - 1].push(x)
    return memo
  }, venueBookings)

  const onModalClose = () => {
    setUnsuccessfulFormSubmitString('')
    setBookingData({
      eventName: '',
      orgId: auth ? auth.orgIds[0] : -1,
    })
    onClose()
  }

  const onModalOpen = () => {
    if (!auth || auth.token === '') {
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

  const [isExpandedCalendar, setExpandedCalendar] = useState(false)
  // CALENDAR EVENT CARD
  // Sets the state of the event card
  const [eventCardPos, setEventCardPos] = useState({ x: 0, y: 0 })
  // Sets the content of the event card
  const [bookingCard, setBookingCard] = useState<BookingDataDisplay | null>(null)

  const handleBookingCard = (event: MouseEvent, booking: BookingDataDisplay) => {
    event.stopPropagation()
    const el = event.target as HTMLElement
    const box = el.getBoundingClientRect()

    setEventCardPos({ x: box.left - 390, y: box.top })
    setBookingCard(booking)
  }
  const hideEventCard = () => {
    setEventCardPos({ x: -1, y: -1 })
  }

  //todo check
  // Frontend login for removing the booking from venueBookings
  // May have to change venueBookings to state to update it
  // We want the booking to be removed from the grid immediately
  // Regardless of whether the delete request is successful
  // If it is unsuccessful, we can just add it back to venueBookings
  const handleDeleteBooking = async (bookingId: number) => {
    const token = !auth || auth.token === '' ? '' : auth?.token
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
          startDate={startDate}
          setUnsuccessfulFormSubmitString={setUnsuccessfulFormSubmitString}
          unsuccessfulFormSubmitString={unsuccessfulFormSubmitString}
          bookingDataFromSelection={bookingDataFromSelection}
          bookingData={bookingData}
          setBookingData={setBookingData}
          auth={auth}
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
                Venue
              </MenuButton>
              <MenuList>
                <MenuOptionGroup defaultValue={VENUES[0]} type='radio'>
                  {VENUES.map((venue) => (
                    <MenuItemOption key={venue} value={venue}>
                      {venue}
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
            setStartDate={setStartDate}
            bookings={bookingsMappedForDisplay}
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
                <BookingsTimesCol boxHeight={BOX_HEIGHT} />
                {VENUES.map((venueName, venueId) => (
                  <BookingVenueCol
                    timeIntervals={timeIntervals}
                    key={venueName}
                    venueName={venueName}
                    openBookingModal={(start, end) => {
                      setBookingDataFromSelection({
                        ...bookingDataFromSelection,
                        venueName,
                        venueId: venueId + 1,
                        start,
                        end,
                      })
                      onModalOpen()
                    }}
                    bookingModalIsOpen={isOpen}
                    // currentVenueBookings={venueBookings[venueId]}
                    currentVenueBookings={venueBookings[venueId]}
                    boxHeight={BOX_HEIGHT}
                    openBookingCard={handleBookingCard}
                  />
                ))}
              </HStack>
            </motion.div>
          )}
        </AnimatePresence>
      </HStack>
    </>
  )
}

const Grid: NextPage<{ allOrgs: OrgInfo[] }> = ({ allOrgs }) => {
  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <BookingsContext.Provider value={{ allOrgs }}>
        <BookingSelector />
      </BookingsContext.Provider>
      <Footer />
    </Flex>
  )
}

export async function getServerSideProps() {
  const orgs = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs')
  const allOrgs = await orgs.json()
  return { props: { allOrgs } }
}

export default Grid
