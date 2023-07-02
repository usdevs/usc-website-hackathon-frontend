import { useBoolean, VStack, Box, Text } from '@chakra-ui/react'
import { addMinutes, isAfter, isEqual, startOfDay } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import { BoxProps } from '@chakra-ui/react'
import {
  BOOKING_CELL_BORDER_Y_REM,
  BOOKING_CELL_HEIGHT_REM,
  isUserLoggedIn,
  useBookingCellStyles,
} from '../../utils'
import { useCurrentHalfHourTime } from '../../hooks/useCurrentHalfHourTime'
import { useUserInfo } from '../../hooks/useUserInfo'

enum CellStatus {
  Available = 'Available',
  Booked = 'Booked by others',
  Selected = 'Selected',
  CellInPast = 'Cell in past',
  CellIsAfterBookingAndSelection = 'Selection made before existing booking and this cell',
}

interface BookingVenueColumnProps extends React.HTMLProps<HTMLDivElement> {
  venueName: String
  openBookingModal: (start: Date, end: Date) => void
  timeIntervals: Date[]
  currentVenueBookings: Array<BookingDataDisplay>
  openBookingCard: (event: React.MouseEvent, booking: BookingDataDisplay | undefined) => void
  orgIdsToColoursMap: NumberToStringJSObject
}

interface BookingVenueTimeCellProps extends React.HTMLProps<HTMLDivElement> {
  isUserLoggedIn: boolean
  cellStatus: CellStatus
  rootFontSize: number
}

const BOX_WIDTH_REM = 8
const INITIAL_FIRST_SELECTED_INDEX = 50
const INITIAL_LAST_SELECTED_INDEX = -1

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

interface BookingCardProps extends React.HTMLProps<HTMLDivElement> {
  booking: BookingDataDisplay
  openBookingCard: (event: React.MouseEvent, booking: BookingDataDisplay | undefined) => void
  orgIdsToColoursMap: NumberToStringJSObject
  auth: AuthState | null
}

// Card which shows details for each booking event
const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  openBookingCard,
  orgIdsToColoursMap,
  auth,
}) => {
  const rootFontSize = 16

  const calculateNumberofTimeBlocks = (start: Date, end: Date) => {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 30))
  }

  // Calculate the difference between start and end of booking divided by 30 minutes
  const bookingSize = calculateNumberofTimeBlocks(booking.from, booking.to)
  const topMarginSize = calculateNumberofTimeBlocks(startOfDay(booking.from), booking.from)

  const isBigCard = bookingSize > 1

  const height =
    (BOOKING_CELL_HEIGHT_REM + 2 * BOOKING_CELL_BORDER_Y_REM) * rootFontSize * bookingSize -
    2 * BOOKING_CELL_BORDER_Y_REM * rootFontSize

  const top =
    (BOOKING_CELL_HEIGHT_REM + 2 * BOOKING_CELL_BORDER_Y_REM) * rootFontSize * topMarginSize

  const isBookedBySelf = booking.userId === auth?.userId

  return (
    <Box
      position='absolute'
      bg={isBookedBySelf ? 'brand.primary' : orgIdsToColoursMap[booking.orgId]}
      w='95%'
      rounded='md'
      h={height + 'px'}
      top={top}
      px='8px'
      py='6px'
      cursor='pointer'
      onClick={(e) => openBookingCard(e, booking)}
    >
      <Text noOfLines={1} fontSize='md' fontWeight='bold' color={'white'} mb='2px'>
        {booking.eventName}
      </Text>
      {isBigCard && (
        <Text noOfLines={2} fontSize='xs' fontWeight='bold' color={'white'}>
          {booking.bookedBy.org.name}
        </Text>
      )}
    </Box>
  )
}

// Individual Grid Cells for the time intervals
const BookingVenueTimeCell: React.FC<BookingVenueTimeCellProps> = ({
  onMouseDown,
  onMouseOver,
  isUserLoggedIn,
  cellStatus,
  rootFontSize,
}) => {
  // Cell is coloured based on whether it's selected or not
  const SharedBoxProps: BoxProps = {
    w: BOX_WIDTH_REM * rootFontSize + 'px',
    h: Math.floor(BOOKING_CELL_HEIGHT_REM * rootFontSize) + 'px',
    boxSizing: 'content-box',
    borderY: BOOKING_CELL_BORDER_Y_REM + 'rem solid',
    transition: '200ms ease-in',
    paddingX: '4px',
  }

  switch (cellStatus) {
    case CellStatus.Booked:
      return <Box {...SharedBoxProps} bg='white' borderColor='white' />
    case CellStatus.CellInPast:
    case CellStatus.CellIsAfterBookingAndSelection:
      return <Box {...SharedBoxProps} bg='gray.200' borderColor='gray.200' />
    case CellStatus.Selected:
      return (
        <Box
          {...SharedBoxProps}
          bg='brand.success.light'
          borderColor='brand.success.light'
          _hover={{
            bg: 'brand.success.dark',
            borderColor: 'brand.success.dark',
            transition: 'none',
          }}
        />
      )
    case CellStatus.Available:
      if (!isUserLoggedIn) {
        return <Box {...SharedBoxProps} bg='gray.100' borderColor='white' />
      } else {
        // Cell is available for booking
        return (
          <Box
            {...SharedBoxProps}
            bg='gray.100'
            borderColor='white'
            onMouseOver={onMouseOver}
            onMouseDown={onMouseDown}
            _hover={{ bg: 'gray.200', transition: 'none' }}
          />
        )
      }
    default: {
      const exhaustiveCheck: never = cellStatus
      return <div></div>
    }
  }
}

// Column of Time Grid Cells for a single venue
const BookingVenueCol: React.FC<BookingVenueColumnProps> = ({
  venueName,
  openBookingModal,
  timeIntervals,
  currentVenueBookings,
  openBookingCard,
  orgIdsToColoursMap,
}) => {
  const isCurrentCellBetweenFirstAndLastSelectedCells = (currentIndex: number): boolean => {
    return smallerSelected <= currentIndex && currentIndex <= largerSelected
  }
  const [mouseIsDown, setMouse] = useBoolean()
  const [smallerSelected, setSmallerSelected] = useState(INITIAL_FIRST_SELECTED_INDEX)
  const [largerSelected, setLargerSelected] = useState(INITIAL_LAST_SELECTED_INDEX)
  const [auth] = useUserInfo()
  const [rootFontSize] = useBookingCellStyles()
  const currentRoundedHalfHourTime = useCurrentHalfHourTime()

  const wrapperRef = useRef(null) //  Used to detect clicks outside of the grid
  useOutsideAlerter(wrapperRef, () => {
    setMouse.off()
    setSmallerSelected(INITIAL_FIRST_SELECTED_INDEX)
    setLargerSelected(INITIAL_LAST_SELECTED_INDEX)
  })

  function getMappedVenueCells() {
    const getCellStatus = (el: Date, i: number) => {
      const venueBooking: BookingDataDisplay | undefined = currentVenueBookings.find((booking) => {
        return (isEqual(el, booking.from) || isAfter(el, booking.from)) && isAfter(booking.to, el)
      })

      const isBooked = venueBooking !== undefined
      if (isBooked) {
        return { cellStatus: CellStatus.Booked, venueBooking }
      }

      const isSelected = isCurrentCellBetweenFirstAndLastSelectedCells(i)
      if (isSelected) {
        return { cellStatus: CellStatus.Selected, venueBooking: undefined }
      }

      const isTimePast = isAfter(currentRoundedHalfHourTime, el)
      if (isTimePast) {
        return { cellStatus: CellStatus.CellInPast, venueBooking: undefined }
      }

      // The cells available for selection are bounded by the adjacent bookings
      // Disable the following cells:
      // - Cells that come after a booking that comes after the startInterval
      // - Cells that come before a booking that comes before the startInterval
      // E.g. Booking from 10am-2pm and 2-4pm. If startInterval is 1pm, then 12am-10am and 4pm-12am are disabled
      const isCellAfterSelectionAndBooking =
        // Okay to loop through all bookings as there are at most
        // 24 bookings for this particular venue and day -> 24 (bookings) * 48 (intervals) iterations
        currentVenueBookings.some((booking) => {
          const startInterval = timeIntervals[smallerSelected]
          return (
            (isAfter(booking.from, startInterval) && isAfter(el, booking.from)) ||
            (isAfter(startInterval, booking.from) && isAfter(booking.from, el))
          )
        })

      if (isCellAfterSelectionAndBooking) {
        return { cellStatus: CellStatus.CellIsAfterBookingAndSelection, venueBooking }
      }

      return { cellStatus: CellStatus.Available, venueBooking }
    }

    const getVenueCell = (
      cellIndex: number,
      venueBooking: BookingDataDisplay | undefined,
      cellStatus: CellStatus,
    ) => {
      const props = {
        // firstSelected is updated when user holds the mouse down
        onMouseDown: () => {
          setSmallerSelected(cellIndex)
          setLargerSelected(cellIndex)
        },
        // lastSelected is updated when cursor moves over a cell while mouse is held down
        onMouseOver: () => {
          if (mouseIsDown) {
            if (cellIndex > smallerSelected) {
              setLargerSelected(cellIndex)
            } else {
              setSmallerSelected(cellIndex)
            }
          }
        },
        isUserLoggedIn: isUserLoggedIn(auth),
        rootFontSize: rootFontSize ?? 16,
        venueBooking,
        orgColour: venueBooking ? orgIdsToColoursMap[venueBooking.orgId] : 'brand.secondary',
      }

      return <BookingVenueTimeCell key={cellIndex} {...props} cellStatus={cellStatus} />
    }

    const cellBlocks = timeIntervals.map((el, i) => {
      const { cellStatus, venueBooking } = getCellStatus(timeIntervals[i], i)
      const isBooked = cellStatus === CellStatus.Booked
      return getVenueCell(i, venueBooking, cellStatus)
    })

    return cellBlocks
  }

  return (
    <VStack ref={wrapperRef} spacing='0'>
      <Text
        fontSize='md'
        position='sticky'
        top='0'
        py='1'
        bg='brand.primary'
        color='white'
        alignSelf='stretch'
        textAlign='center'
        zIndex='100'
      >
        {venueName}
      </Text>
      <VStack
        position='relative'
        spacing='0'
        alignItems='start'
        onMouseDown={setMouse.on}
        onMouseUp={() => {
          setMouse.off()
          const isSelectionMade = smallerSelected !== INITIAL_FIRST_SELECTED_INDEX
          if (isSelectionMade) {
            openBookingModal(
              timeIntervals[smallerSelected],
              addMinutes(timeIntervals[largerSelected], 30),
            )
          }
        }}
      >
        {currentVenueBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            openBookingCard={openBookingCard}
            orgIdsToColoursMap={orgIdsToColoursMap}
            auth={auth}
          />
        ))}
        {getMappedVenueCells()}
      </VStack>
    </VStack>
  )
}

export default BookingVenueCol
