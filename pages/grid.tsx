import * as React from 'react'
import { useState, useRef, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Box,
  HStack,
  VStack,
  Center,
  Text,
  Select,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Button,
  MenuOptionGroup,
} from '@chakra-ui/react'
import { useBoolean, useDisclosure } from '@chakra-ui/react'

import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval'
import format from 'date-fns/format'

import { BookingConfirmationPopup } from '../components/BookingConfirmationPopup'
import { BookingsContext } from './BookingsContext'
import { addMinutes, isAfter, isSameDay, sub } from 'date-fns'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import Footer from '../components/Footer'
import { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import Calendar from '../components/Calendar'
import { ChevronDownIcon } from '@chakra-ui/icons'

// Types for the Bookings Components
// To be moved to global types file after replacing the old Bookings page
interface VenueBookingProps {
  venueName: String
  openBookingModal: (start: Date, end: Date) => void
  bookingModalIsOpen: boolean
  timeIntervals: Date[]
}

interface VenueTimeCellProps {
  onMouseDown: () => void
  onMouseOver: () => void
  booked: boolean
  selected: boolean
}

const BOX_HEIGHT = 8 // Ensures time labels are aligned with grid cells
const VENUES = ['CTPH', 'Chatterbox', "Maker's Studio", 'Amphi', 'TRR', 'TRB']

// Detects clicks outside of the grid
function useOutsideAlerter(ref: any, callback: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: any) =>
      ref.current && !ref.current.contains(event.target) && callback()

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

// Individual Grid Cells for the time intervals
const VenueTimeCell: React.FC<VenueTimeCellProps> = ({
  onMouseDown,
  onMouseOver,
  booked,
  selected,
}) => {
  // Cell is coloured based on whether it's selected or not
  return (
    <Box
      w='40'
      h={BOX_HEIGHT}
      bg={booked ? 'green.500' : selected ? 'blue.500' : 'gray.200'}
      _hover={{ bg: booked ? 'green.700' : selected ? 'blue.700' : 'gray.300' }}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
    ></Box>
  )
}

// Column of Time Grid Cells for a single venue
const VenueBooking: React.FC<VenueBookingProps> = ({
  venueName,
  openBookingModal,
  bookingModalIsOpen,
  timeIntervals,
}) => {
  // Helper function to check if the current cell is between the first and last selected cells
  const between = (currentIndex: number, x: number, y: number): boolean => {
    const startIndex = Math.min(x, y)
    const endIndex = Math.max(x, y)

    return currentIndex >= startIndex && currentIndex <= endIndex
  }
  // Venue column works by colouring in cells between firstSelected and lastSelected
  // firstSelected is updated when user holds the mouse down
  // lastSelected is updated when cursor moves over a cell while mouse is held down
  const [mouseIsDown, setMouse] = useBoolean()
  const [firstSelected, setFirst] = useState(-1)
  const [lastSelected, setLast] = useState(-1)

  const wrapperRef = useRef(null) //  Used to detect clicks outside of the grid
  useOutsideAlerter(wrapperRef, () => {
    if (bookingModalIsOpen) return // Don't deselect if booking modal is open
    setFirst(-1)
    setLast(-1)
  })

  // Bookings from the backend
  const bookingsFromBackend: BackendBookingInfo[] = useContext(BookingsContext)
  // Convert the bookings from the backend into a format that can be used by the grid
  // Filter bookings to only show bookings for the current day and the current venue
  const bookings = bookingsFromBackend
    .map((booking) => ({
      ig: booking.orgId.toString(),
      venue: 'CTPH', //x.venueId.toString(),
      bookedBy: booking.userId.toString(),
      // Subtract 1 minute to the start time to properly display the booking
      from: sub(Date.parse(booking.start), { minutes: 1 }),
      to: Date.parse(booking.end),
    }))
    .filter((booking) => isSameDay(booking.to, timeIntervals[0]))
    .filter((booking) => booking.venue === venueName)

  // Test data for venue bookings
  // To be removed after replacing the old Bookings page
  const bookingsTest = [
    {
      ig: '1',
      venue: 'CTPH',
      bookedBy: '1',
      from: Date.parse('2023-03-18T08:00:00.000Z'),
      to: Date.parse('2023-03-18T10:00:00.000Z'),
    },
    {
      ig: '1',
      venue: 'Amphi',
      bookedBy: '1',
      from: Date.parse('2023-03-18T10:00:00.000Z'),
      to: Date.parse('2023-03-18T11:00:00.000Z'),
    },
    {
      ig: '1',
      venue: 'CTPH',
      bookedBy: '1',
      from: Date.parse('2023-03-18T11:00:00.000Z'),
      to: Date.parse('2023-03-18T12:00:00.000Z'),
    },
  ]
    .map((booking) => ({ ...booking, from: sub(booking.from, { minutes: 1 }) }))
    .filter((booking) => isSameDay(booking.to, timeIntervals[0]))
    .filter((booking) => booking.venue === venueName)

  return (
    <VStack ref={wrapperRef} spacing='0'>
      <Text fontSize='lg'>{venueName}</Text>
      <VStack
        onMouseDown={setMouse.on}
        onMouseUp={() => {
          setMouse.off()
          if (firstSelected === -1) return
          // If selection has been made, open the booking modal
          const start = Math.min(firstSelected, lastSelected)
          const end = Math.max(firstSelected, lastSelected)
          openBookingModal(timeIntervals[start], addMinutes(timeIntervals[end], 30))
        }}
      >
        {timeIntervals.map((el, i) => {
          // Check if the current cell is booked
          const isBooked = bookingsTest.some((booking) => {
            return isAfter(el, booking.from) && isAfter(booking.to, el)
          })
          return (
            <VenueTimeCell
              key={i}
              booked={isBooked}
              onMouseDown={() => {
                if (isBooked) return
                setFirst(i)
                setLast(i)
              }}
              onMouseOver={() => {
                mouseIsDown && !isBooked && setLast(i)
              }}
              selected={!isBooked && between(i, firstSelected, lastSelected)}
            />
          )
        })}
      </VStack>
    </VStack>
  )
}

// Labels for time 0000-2330
const BookingTimes: React.FC = () => {
  // Format the time intervals into strings
  const timeStrings = eachMinuteOfInterval(
    {
      start: new Date(2000, 1, 1, 0), // Start at 0000
      end: new Date(2000, 1, 1, 23, 59), // End at 2359
    },
    { step: 30 },
  ).map((el) => format(el, 'HH:mm'))

  return (
    <VStack spacing='0'>
      <Text fontSize={'lg'}>Time</Text>
      <VStack>
        {timeStrings.map((el, i) => (
          <Center h={BOX_HEIGHT} key={el}>
            {/* Ensures time labels are aligned with grid cells */}
            <Box>{el}</Box>
          </Center>
        ))}
      </VStack>
    </VStack>
  )
}

const BookingSelector: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bookingDataFromSelection, setBookingDataFromSelection] =
    useState<BookingDataFromSelection>({
      start: null,
      end: null,
      venueId: 1,
      venue: '',
    })
  const [unsuccessfulFormSubmitString, setUnsuccessfulFormSubmitString] = useState<string>('')
  const onModalClose = () => {
    setUnsuccessfulFormSubmitString('')
    onClose()
  }

  const [startDate, setStartDate] = React.useState<Date>(new Date())
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

  return (
    <VStack px={12} py={4} alignItems={'start'}>
      <BookingConfirmationPopup
        isOpen={isOpen}
        onClose={onModalClose}
        startDate={startDate}
        setUnsuccessfulFormSubmitString={setUnsuccessfulFormSubmitString}
        unsuccessfulFormSubmitString={unsuccessfulFormSubmitString}
        bookingDataFromSelection={bookingDataFromSelection}
      />
      <Box maxWidth={'125px'}></Box>

      {/* Different tabs for day and month view */}
      <Tabs variant='solid-rounded' colorScheme='blue'>
        <TabList w={320}>
          {/* Hardcoded values for width - to be updated */}
          <SingleDatepicker name='date-input' date={startDate} onDateChange={setStartDate} />
          <motion.div whileHover={{ scale: 1.1 }}>
            <Tab mx={4}>Day</Tab>
          </motion.div>
          <Tab>Month</Tab>
        </TabList>
        <TabPanels>
          {/* Day view */}
          <TabPanel>
            <HStack>
              <BookingTimes />
              {VENUES.map((venueName, venueId) => (
                <VenueBooking
                  timeIntervals={timeIntervals}
                  key={venueName}
                  venueName={venueName}
                  openBookingModal={(start, end) => {
                    setBookingDataFromSelection({
                      ...bookingDataFromSelection,
                      venue: venueName,
                      venueId: venueId,
                      start,
                      end,
                    })
                    onOpen()
                  }}
                  bookingModalIsOpen={isOpen}
                />
              ))}
            </HStack>
          </TabPanel>
          {/* Month view */}
          <TabPanel>
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
            <Calendar />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

const Bookings: NextPage<{ currentUserBookings: BackendBookingInfo[] }> = ({
  currentUserBookings,
}) => {
  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <BookingsContext.Provider value={currentUserBookings}>
        <BookingSelector />
      </BookingsContext.Provider>
      <Footer />
    </Flex>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings?userId=1')
  const currentUserBookings = await res.json()
  return { props: { currentUserBookings } }
}

export default Bookings
