import { useBoolean, VStack, Box, Text } from '@chakra-ui/react';
import { addMinutes, isAfter } from 'date-fns';
import { useState, useRef, useEffect } from 'react';

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
}) => {
  // Cell is coloured based on whether it's selected or not

  const cellColor = booked ? 'green.500' : selected ? 'blue.500' : 'gray.200';
  const cellHoverColor = booked ? 'green.700' : selected ? 'blue.700' : 'gray.300';
  const borderColor = booked ? 'green.500' : selected ? 'blue.500' : 'white';
  const borderHoverColor = booked ? 'green.700' : selected ? 'blue.700' : 'white';

  return (
    <Box
      w='40'
      h={boxHeight}
      bg={cellColor}
      _hover={{ bg: cellHoverColor, borderColor: borderHoverColor }}
      boxSizing='content-box'
      borderY='.2rem solid'
      borderColor={borderColor}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
    ></Box>
  );
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

  return (
    <VStack ref={wrapperRef} spacing='0'>
      <Text fontSize='lg'>{venueName}</Text>
      <VStack
        spacing='0'
        onMouseDown={setMouse.on}
        onMouseUp={() => {
          setMouse.off();
          if (firstSelected === -1) return;
          // If selection has been made, open the booking modal
          const start = Math.min(firstSelected, lastSelected);
          const end = Math.max(firstSelected, lastSelected);
          openBookingModal(timeIntervals[start], addMinutes(timeIntervals[end], 30));
        }}
      >
        {timeIntervals.map((el, i) => {
          // Check if the current cell is booked
          const isBooked = currentVenueBookings.some((booking) => {
            return isAfter(el, booking.from) && isAfter(booking.to, el);
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
              boxHeight={boxHeight}
            />
          );
        })}
      </VStack>
    </VStack>
  );
};

export default BookingVenueCol;
