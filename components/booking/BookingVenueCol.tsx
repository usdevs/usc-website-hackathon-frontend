import { useBoolean, VStack, Box, Text } from '@chakra-ui/react'
import { addMinutes, isAfter, isEqual } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import { BoxProps } from '@chakra-ui/react'
import {
  BOOKING_CELL_BORDER_Y_REM,
  BOOKING_CELL_HEIGHT_REM,
  isUserLoggedIn,
  useBookingCellStyles,
  useUserInfo,
} from '../../utils'

enum CellStatus {
  Available = 'Available',
  Booked = 'Booked by others',
  BookedBySelf = 'Booked by self',
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
}

interface BookingVenueTimeCellProps extends React.HTMLProps<HTMLDivElement> {
  isUserLoggedIn: boolean
  cellStatus: CellStatus
  numberOfCells: number
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

// Individual Grid Cells for the time intervals
const BookingVenueTimeCell: React.FC<BookingVenueTimeCellProps> = ({
  onMouseDown,
  onMouseOver,
  onClick,
  isUserLoggedIn,
  cellStatus,
  numberOfCells,
  rootFontSize,
}) => {
  // Cell is coloured based on whether it's selected or not
  const SharedBoxProps: BoxProps = {
    w: BOX_WIDTH_REM * rootFontSize + 'px',
    h:
      Math.floor(
        BOOKING_CELL_HEIGHT_REM * numberOfCells * rootFontSize +
          rootFontSize * (numberOfCells - 1) * BOOKING_CELL_BORDER_Y_REM * 2,
      ) + 'px',
    boxSizing: 'content-box',
    borderY: BOOKING_CELL_BORDER_Y_REM + 'rem solid',
    transition: '200ms ease-in',
  }

  if (cellStatus === CellStatus.Booked) {
    return (
      <Box
        {...SharedBoxProps}
        bg='brand.secondary'
        borderColor='white'
        cursor='pointer'
        onClick={onClick}
      />
    )
  } else if (cellStatus === CellStatus.BookedBySelf) {
    return (
      <Box
        {...SharedBoxProps}
        bg='brand.primary'
        borderColor='white'
        cursor='pointer'
        onClick={onClick}
      />
    )
  } else if (
    cellStatus === CellStatus.CellInPast ||
    cellStatus === CellStatus.CellIsAfterBookingAndSelection
  ) {
    return <Box {...SharedBoxProps} bg='gray.200' borderColor='gray.200' />
  } else if (cellStatus === CellStatus.Selected) {
    return (
      <Box
        {...SharedBoxProps}
        bg='brand.success.light'
        borderColor='brand.success.light'
        _hover={{ bg: 'brand.success.dark', borderColor: 'brand.success.dark', transition: 'none' }}
      />
    )
  } else if (!isUserLoggedIn) {
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
}

// Column of Time Grid Cells for a single venue
const BookingVenueCol: React.FC<BookingVenueColumnProps> = ({
  venueName,
  openBookingModal,
  timeIntervals,
  currentVenueBookings,
  openBookingCard,
}) => {
  const isCurrentCellBetweenFirstAndLastSelectedCells = (currentIndex: number): boolean => {
    return smallerSelected <= currentIndex && currentIndex <= largerSelected
  }
  const [mouseIsDown, setMouse] = useBoolean()
  const [smallerSelected, setSmallerSelected] = useState(INITIAL_FIRST_SELECTED_INDEX)
  const [largerSelected, setLargerSelected] = useState(INITIAL_LAST_SELECTED_INDEX)
  const [auth] = useUserInfo()
  const [rootFontSize] = useBookingCellStyles()

  const wrapperRef = useRef(null) //  Used to detect clicks outside of the grid
  useOutsideAlerter(wrapperRef, () => {
    setMouse.off()
    setSmallerSelected(INITIAL_FIRST_SELECTED_INDEX)
    setLargerSelected(INITIAL_LAST_SELECTED_INDEX)
  })

  function getMappedVenueCells() {
    const getCellStatus = (el: Date, i: number) => {
      let cellStatus = CellStatus.Available

      const isTimePast = isAfter(new Date(), el)
      // Disables cell if there is a booking before the cell and the user is selecting
      // cells before that booking
      const isCellAfterSelectionAndBooking =
        // Okay to loop through all bookings as there are at most
        // 24 bookings for this particular venue and day
        currentVenueBookings.some((booking) => {
          const startInterval = timeIntervals[smallerSelected]
          return (
            (isAfter(booking.from, startInterval) && isAfter(el, booking.from)) ||
            (isAfter(startInterval, booking.from) && isAfter(booking.from, el))
          )
        })

      const venueBooking: BookingDataDisplay | undefined = currentVenueBookings.find((booking) => {
        return (isEqual(el, booking.from) || isAfter(el, booking.from)) && isAfter(booking.to, el)
      })
      const isBooked = venueBooking !== undefined
      if (isBooked) {
        cellStatus = CellStatus.Booked
        if (venueBooking?.userId === auth?.userId) {
          cellStatus = CellStatus.BookedBySelf
        }
      } else if (isCurrentCellBetweenFirstAndLastSelectedCells(i)) {
        cellStatus = CellStatus.Selected
      } else if (isTimePast) {
        cellStatus = CellStatus.CellInPast
      } else if (isCellAfterSelectionAndBooking) {
        cellStatus = CellStatus.CellIsAfterBookingAndSelection
      }
      return { cellStatus, venueBooking }
    }

    const getVenueCell = (
      cellIndex: number,
      blockIndex: number,
      numberOfCells: number,
      isBooked: boolean,
      venueBooking: BookingDataDisplay | undefined,
      cellStatus: CellStatus,
    ) => {
      const props = {
        numberOfCells,
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
        onClick: (e: React.MouseEvent) => {
          if (isBooked) openBookingCard(e, venueBooking)
        },
        isUserLoggedIn: isUserLoggedIn(auth),
        rootFontSize: rootFontSize ?? 16,
      }

      return <BookingVenueTimeCell key={cellIndex} {...props} cellStatus={cellStatus} />
    }

    const cellBlocks = []
    let numberOfCells = 1
    let countOfDisplayedBlocks = 0
    let { cellStatus: statusOfPreviousCell, venueBooking: venueBookingOfPreviousCell } =
      getCellStatus(timeIntervals[0], 0)

    const pushPreviousBlockIntoArray = (cellIndex: number, isBooked: boolean) => {
      cellBlocks.push(
        getVenueCell(
          cellIndex,
          countOfDisplayedBlocks,
          numberOfCells,
          isBooked,
          venueBookingOfPreviousCell,
          statusOfPreviousCell,
        ),
      )
      numberOfCells = 1
      countOfDisplayedBlocks++
    }

    for (let i = 1; i < timeIntervals.length; i++) {
      const { cellStatus: statusOfCurrentCell, venueBooking: venueBookingOfCurrentCell } =
        getCellStatus(timeIntervals[i], i)
      if (
        statusOfPreviousCell === CellStatus.Booked ||
        statusOfPreviousCell === CellStatus.BookedBySelf
      ) {
        if (statusOfCurrentCell !== statusOfPreviousCell) {
          pushPreviousBlockIntoArray(i - 1, true)
        } else {
          if (venueBookingOfPreviousCell?.userId !== venueBookingOfCurrentCell?.userId) {
            pushPreviousBlockIntoArray(i - 1, true)
          } else {
            numberOfCells++
          }
        }
      } else {
        pushPreviousBlockIntoArray(i - 1, false)
      }
      statusOfPreviousCell = statusOfCurrentCell
      venueBookingOfPreviousCell = venueBookingOfCurrentCell
    }
    const isBooked =
      statusOfPreviousCell === CellStatus.Booked || statusOfPreviousCell === CellStatus.BookedBySelf
    cellBlocks.push(
      getVenueCell(
        timeIntervals.length - 1,
        countOfDisplayedBlocks,
        numberOfCells,
        isBooked,
        venueBookingOfPreviousCell,
        statusOfPreviousCell,
      ),
    )
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
      >
        {venueName}
      </Text>
      <VStack
        spacing='0'
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
        {getMappedVenueCells()}
      </VStack>
    </VStack>
  )
}

export default BookingVenueCol
