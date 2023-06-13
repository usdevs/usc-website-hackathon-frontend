import { useBoolean, VStack, Box, Text } from '@chakra-ui/react'
import { addMinutes, isAfter, isEqual } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import { BoxProps } from '@chakra-ui/react'
import { BOOKING_CELL_BORDER_Y_REM, BOOKING_CELL_HEIGHT_REM, isUserLoggedIn, useBookingCellStyles, useUserInfo } from "../../utils";

enum CellStatus {
  Available,
  Booked,
  BookedBySelf,
  Selected,
  Disabled,
}

interface BookingVenueColumnProps extends React.HTMLProps<HTMLDivElement> {
  venueName: String
  openBookingModal: (start: Date, end: Date) => void
  timeIntervals: Date[]
  currentVenueBookings: Array<BookingDataDisplay>
  openBookingCard: (event: React.MouseEvent, booking: BookingDataDisplay) => void
}

interface BookingVenueTimeCellProps extends React.HTMLProps<HTMLDivElement> {
  isUserLoggedIn: boolean
  cellStatus: CellStatus
  numberOfCells: number
  rootFontSize: number
}

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

const BOX_WIDTH_REM = 8;

// Individual Grid Cells for the time intervals
const BookingVenueTimeCell: React.FC<BookingVenueTimeCellProps> = ({
  onMouseDown,
  onMouseOver,
  onMouseUp,
  onClick,
  isUserLoggedIn,
  cellStatus,
  numberOfCells,
  rootFontSize
}) => {
  // Cell is coloured based on whether it's selected or not
  const SharedBoxProps: BoxProps = {
    w: BOX_WIDTH_REM * rootFontSize + 'px',
    h: Math.floor(BOOKING_CELL_HEIGHT_REM * numberOfCells * rootFontSize + rootFontSize * (numberOfCells - 1) * BOOKING_CELL_BORDER_Y_REM * 2) + 'px',
    boxSizing: 'content-box',
    borderY: BOOKING_CELL_BORDER_Y_REM + 'rem solid',
    transition: '200ms ease-in',
  }

  if (cellStatus === CellStatus.Booked) {
    return (
      <Box
        {...SharedBoxProps}
        bg='brand.secondary'
        borderColor='brand.secondary'
        cursor='pointer'
        onMouseUp={onMouseUp}
        onClick={onClick}/>
    )
  } else if (cellStatus === CellStatus.BookedBySelf) {
    return (
      <Box
        {...SharedBoxProps}
        bg='brand.primary'
        borderColor='brand.primary'
        cursor='pointer'
        onMouseUp={onMouseUp}
        onClick={onClick}
      />
    )
  } else if (cellStatus === CellStatus.Disabled) {
    return <Box {...SharedBoxProps} bg='gray.200' borderColor='gray.200' onMouseUp={onMouseUp} />
  } else if (cellStatus === CellStatus.Selected) {
    return (
      <Box
        {...SharedBoxProps}
        bg='brand.success.light'
        borderColor='brand.success.light'
        _hover={{ bg: 'brand.success.dark', borderColor: 'brand.success.dark', transition: 'none' }}
        onMouseUp={onMouseUp}
      />
    )
  } else if (!isUserLoggedIn) {
    return <Box {...SharedBoxProps} bg='gray.100' borderColor='white' onMouseUp={onMouseUp} />
  } else {
    // Cell is available for booking
    return (
      <Box
        {...SharedBoxProps}
        bg='gray.100'
        borderColor='white'
        onMouseOver={onMouseOver}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        _hover={{ bg: 'gray.200', transition: 'none' }}
      />
    )
  }
}

// Column of Time Grid Cells for a single venue
const BookingVenueCol: React.FC<BookingVenueColumnProps> = ({
  venueName,
  openBookingModal,
  timeIntervals,
  currentVenueBookings,
  openBookingCard,
}) => {
  const isCellBetweenFirstAndLastSelected = (
    currentIndex: number,
    x: number,
    y: number,
  ): boolean => {
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
  const [auth] = useUserInfo()
  const [rootFontSize] = useBookingCellStyles();

  const wrapperRef = useRef(null) //  Used to detect clicks outside of the grid
  useOutsideAlerter(wrapperRef, () => {
    setMouse.off()
    setFirst(-1)
    setLast(-1)
  })

  const start = Math.min(firstSelected, lastSelected)
  const end = Math.max(firstSelected, lastSelected)

  function getMappedVenueCells() {
    return timeIntervals.map((el, i) => {
      const props = {
        numberOfCells: 1,
        onMouseDown: () => {
          setFirst(i);
          setLast(i);
        },
        onMouseOver: () => {
          if (mouseIsDown && !isBooked) setLast(i);
        },
        onClick: (e: React.MouseEvent) => {
          if (isBooked) openBookingCard(e, venueBooking);
        },
        isUserLoggedIn: isUserLoggedIn(auth),
        rootFontSize: rootFontSize ?? 16
      }

      let cellStatus = CellStatus.Available;
      // Prevent selecting a time that is already booked or is in the past
      const isCellDisabled =
        // Okay to loop through all bookings as there are at most
        // 24 bookings for this particular venue and day
        currentVenueBookings.some((booking) => {
          const startInterval = timeIntervals[start]
          return (
            (isAfter(booking.from, startInterval) && isAfter(el, booking.from)) ||
            (isAfter(startInterval, booking.from) && isAfter(booking.from, el))
          )
        }) || isAfter(new Date(), el)

      const venueBooking: BookingDataDisplay | undefined = currentVenueBookings.find((booking) => {
        return (isEqual(el, booking.from) || isAfter(el, booking.from)) && isAfter(booking.to, el)
      })
      const isBooked = venueBooking !== undefined
      if (isBooked) {
        cellStatus = CellStatus.Booked
        if (venueBooking?.userId === auth?.userId) {
          cellStatus = CellStatus.BookedBySelf
        }
      } else if (!isBooked && isCellBetweenFirstAndLastSelected(i, firstSelected, lastSelected)) {
        cellStatus = CellStatus.Selected
      } else if (isCellDisabled) {
        cellStatus = CellStatus.Disabled
      }

      return (
        <BookingVenueTimeCell key={i} {...props} cellStatus={cellStatus}/>
      );
    });
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
      >
        {venueName}
      </Text>
      <VStack
        spacing='0'
        onMouseDown={setMouse.on}
        onMouseUp={() => {
          setMouse.off()
          if (firstSelected === -1) return
          // If selection has been made, open the booking modal
          openBookingModal(timeIntervals[start], addMinutes(timeIntervals[end], 30))
        }}
      >
        {getMappedVenueCells()}
      </VStack>
    </VStack>
  )
}

export default BookingVenueCol
