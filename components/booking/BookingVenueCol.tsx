import {
  useBoolean,
  VStack,
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';
import { addMinutes, isAfter } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { BoxProps } from '@chakra-ui/react';

// Types for the BookingsOld Components
// To be moved to global types file after replacing the old BookingsOld page
interface BookingVenueColumnProps {
  venueName: String;
  openBookingModal: (start: Date, end: Date) => void;
  bookingModalIsOpen: boolean;
  timeIntervals: Date[];
  currentVenueBookings: Array<BookingDataDisplay>;
  boxHeight: number;
}

interface BookingVenueTimeCellProps {
  onMouseDown: () => void;
  onMouseOver: () => void;
  booked: boolean;
  selected: boolean;
  boxHeight: number;
  disabled: boolean;
}

// Detects clicks outside of the grid
function useOutsideAlerter(ref: any, callback: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: any) =>
      ref.current && !ref.current.contains(event.target) && callback();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

// Individual Grid Cells for the time intervals
const BookingVenueTimeCell: React.FC<BookingVenueTimeCellProps> = ({
  onMouseDown,
  onMouseOver,
  booked,
  selected,
  boxHeight,
  disabled,
}) => {
  // Cell is coloured based on whether it's selected or not

  const SharedBoxProps: BoxProps = {
    w: '40',
    h: boxHeight,
    boxSizing: 'content-box',
    borderY: '.2rem solid',
    transition: '200ms ease-in',
  };

  if (booked) {
    return (
      <Box
        {...SharedBoxProps}
        bg='green.500'
        borderColor='green.500'
        _hover={{ bg: 'green.700', borderColor: 'green.700', transition: 'none' }}
      />
    );
  } else if (disabled) {
    return <Box {...SharedBoxProps} bg='gray.300' borderColor='gray.300' />;
  } else if (selected) {
    return (
      <Box
        {...SharedBoxProps}
        bg='blue.500'
        borderColor='blue.500'
        _hover={{ bg: 'blue.700', borderColor: 'blue.700', transition: 'none' }}
      />
    );
  } else {
    return (
      <Box
        {...SharedBoxProps}
        bg='gray.200'
        borderColor='white'
        onMouseOver={onMouseOver}
        onMouseDown={onMouseDown}
        _hover={{ bg: 'gray.300', transition: 'none' }}
      />
    );
  }
};

// Column of Time Grid Cells for a single venue
const BookingVenueCol: React.FC<BookingVenueColumnProps> = ({
  venueName,
  openBookingModal,
  bookingModalIsOpen,
  timeIntervals,
  currentVenueBookings,
  boxHeight,
}) => {
  // Helper function to check if the current cell is between the first and last selected cells
  const between = (currentIndex: number, x: number, y: number): boolean => {
    const startIndex = Math.min(x, y);
    const endIndex = Math.max(x, y);

    return currentIndex >= startIndex && currentIndex <= endIndex;
  };
  // Venue column works by colouring in cells between firstSelected and lastSelected
  // firstSelected is updated when user holds the mouse down
  // lastSelected is updated when cursor moves over a cell while mouse is held down
  const [mouseIsDown, setMouse] = useBoolean();
  const [firstSelected, setFirst] = useState(-1);
  const [lastSelected, setLast] = useState(-1);

  const wrapperRef = useRef(null); //  Used to detect clicks outside of the grid
  useOutsideAlerter(wrapperRef, () => {
    if (bookingModalIsOpen) return; // Don't deselect if booking modal is open
    setFirst(-1);
    setLast(-1);
  });

  const getStartEnd = () => [
    Math.min(firstSelected, lastSelected),
    Math.max(firstSelected, lastSelected),
  ];

  return (
    <VStack ref={wrapperRef} spacing='0'>
      <Text fontSize='lg' position='sticky'>
        {venueName}
      </Text>
      <VStack
        spacing='0'
        onMouseDown={setMouse.on}
        onMouseUp={() => {
          setMouse.off();
          if (firstSelected === -1) return;
          // If selection has been made, open the booking modal
          const [start, end] = getStartEnd();
          openBookingModal(timeIntervals[start], addMinutes(timeIntervals[end], 30));
        }}
      >
        {timeIntervals.map((el, i) => {
          // Check if the current cell is booked
          const isBooked = currentVenueBookings.some((booking) => {
            return isAfter(el, booking.from) && isAfter(booking.to, el);
          });

          // Check if there is a booking between start and end
          const disabledBooking = currentVenueBookings.some((booking) => {
            const [start, _] = getStartEnd();
            const startInterval = timeIntervals[start];
            return isAfter(booking.from, startInterval) && isAfter(el, booking.from);
          });

          return (
            <BookingVenueTimeCell
              key={i}
              booked={isBooked}
              onMouseDown={() => {
                if (isBooked) return;
                setFirst(i);
                setLast(i);
              }}
              onMouseOver={() => {
                mouseIsDown && !isBooked && setLast(i);
              }}
              selected={!isBooked && between(i, firstSelected, lastSelected)}
              disabled={isAfter(new Date(), el) || disabledBooking}
              boxHeight={boxHeight}
            />
          );
        })}
      </VStack>
    </VStack>
  );
};

export default BookingVenueCol;
