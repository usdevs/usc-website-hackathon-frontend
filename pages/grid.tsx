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
  useToast,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Button,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { useBoolean, useDisclosure } from '@chakra-ui/react';

import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval';
import format from 'date-fns/format';

import { BookingConfirmationPopup } from '../components/BookingConfirmationPopup';
import { BookingsContext, BookingsContextValue } from './BookingsContext';
import { isAfter, isSameDay, sub, addMinutes } from 'date-fns';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import Footer from '../components/Footer';
import { NextPage } from 'next';
import NavMenu from '../components/NavMenu';
import { useLocalStorage } from '../components/swr-internal-state-main';
import Calendar from '../components/Calendar'
import { ChevronDownIcon } from '@chakra-ui/icons'

// Types for the BookingsOld Components
// To be moved to global types file after replacing the old BookingsOld page
interface VenueBookingProps {
  venueName: String;
  openBookingModal: (start: Date, end: Date) => void;
  bookingModalIsOpen: boolean;
  timeIntervals: Date[];
  currentVenueBookings: Array<BookingDataDisplay>;
}

interface VenueTimeCellProps {
  onMouseDown: () => void;
  onMouseOver: () => void;
  booked: boolean;
  selected: boolean;
}

const BOX_HEIGHT = 8; // Ensures time labels are aligned with grid cells
const VENUES = ['CTPH', 'Chatterbox', "Maker's Studio", 'Amphi', 'TRR', 'TRB'];

const useUserInfo = () => useLocalStorage<AuthState>('token-value');

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
  );
};

// Column of Time Grid Cells for a single venue
const VenueBooking: React.FC<VenueBookingProps> = ({
  venueName,
  openBookingModal,
  bookingModalIsOpen,
  timeIntervals,
  currentVenueBookings,
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
        onMouseDown={setMouse.on}
        onMouseUp={() => {
          setMouse.off();
          if (firstSelected === -1) return;
          // If selection has been made, open the booking modal
          const start = Math.min(firstSelected, lastSelected)
          const end = Math.max(firstSelected, lastSelected)
          openBookingModal(timeIntervals[start], addMinutes(timeIntervals[end], 30))
        }}
      >
        {timeIntervals.map((el, i) => {
          // Check if the current cell is booked
          const isBooked = currentVenueBookings.some((booking) => {
            return isAfter(el, booking.from) && isAfter(booking.to, el);
          });
          return (
            <VenueTimeCell
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
            />
          );
        })}
      </VStack>
    </VStack>
  );
};

// Labels for time 0000-2330
const BookingTimes: React.FC = () => {
  // Format the time intervals into strings
  const timeStrings = eachMinuteOfInterval(
    {
      start: new Date(2000, 1, 1, 0), // Start at 0000
      end: new Date(2000, 1, 1, 23, 59), // End at 2359
    },
    { step: 30 },
  ).map((el) => format(el, 'HH:mm'));

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
  );
};

const BookingSelector: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bookingDataFromSelection, setBookingDataFromSelection] = useState<BookingDataSelection>({
    start: null,
    end: null,
    venueId: -1,
    venueName: '',
  });
  const [unsuccessfulFormSubmitString, setUnsuccessfulFormSubmitString] = useState<string>('');
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [auth] = useUserInfo();
  const [bookingData, setBookingData] = useState<BookingDataForm>({
    event: '',
    orgId: auth ? auth.orgIds[0] : -1,
  });
  const toast = useToast();
  const toast_id = 'auth-toast';
  const [allBookings, setAllBookings] = useState<BookingDataBackend[]>([]);

  useEffect(() => {
    (async () => {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startDate);
      endOfDay.setHours(23, 59, 59, 999);
      const currentBookings = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL +
        'bookings/all?start=' +
        startOfDay.toISOString() +
        '&end=' +
        endOfDay,
      );
      const allBookings = await currentBookings.json();
      console.log(allBookings);
      setAllBookings(allBookings);
    })();
    return () => {};
  }, [startDate])

  // Create time intervals for the current date
  const timeIntervals = (() => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();
    return eachMinuteOfInterval(
      {
        start: new Date(year, month, day, 0),
        end: new Date(year, month, day, 23, 59),
      },
      { step: 30 },
    );
  })();

  const venueBookings: Array<Array<BookingDataDisplay>> = new Array(6)
    .fill(0)
    .map(() => new Array(0));
  // Convert the bookings from the backend into a format that can be used by the grid
  // Filter bookings to only show bookings for the current day and the current venue
  allBookings
    .map((booking) => ({
      ig: booking.orgId.toString(),
      venueId: booking.venueId,
      bookedBy: booking.userId.toString(),
      // Subtract 1 minute to the start time to properly display the booking
      from: sub(Date.parse(booking.start), { minutes: 1 }),
      to: new Date(booking.end),
    }))
    // TODO fix, this is broken for some strange reason cuz of the +8; we do not need it anyways because we specify
    //  start and end to backend now, but good to have
    // .filter((booking) => isSameDay(booking.to, timeIntervals[0]))
    .reduce(function (memo, x) {
      memo[x['venueId'] - 1].push(x);
      return memo;
    }, venueBookings);

  const onModalClose = () => {
    setUnsuccessfulFormSubmitString('');
    setBookingData({
      event: '',
      orgId: auth ? auth.orgIds[0] : -1,
    });
    onClose();
  };

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
        });
      }
    } else {
      setBookingData({
        event: '',
        orgId: auth ? auth.orgIds[0] : -1,
      });
      onOpen();
    }
  };

  return (
    <VStack px={12} py={4} alignItems={'start'}>
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
        />
      ) : (
        <></>
      )}
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
                      venueName,
                      venueId: venueId + 1,
                      start,
                      end,
                    });
                    onModalOpen();
                  }}
                  bookingModalIsOpen={isOpen}
                  currentVenueBookings={venueBookings[venueId]}
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
  );
};

const Grid: NextPage<{ allBookings: BookingDataBackend[]; allOrgs: OrgInfo[] }> = ({
  allBookings,
  allOrgs,
}) => {
  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <BookingsContext.Provider value={{ allOrgs, refreshData }}>
        <BookingSelector />
      </BookingsContext.Provider>
      <Footer />
    </Flex>
  );
};

// TODO we should use getStaticProps here
export async function getServerSideProps() {
  const orgs = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs');
  const allOrgs = await orgs.json();
  return { props: { allOrgs } };
}

export default Grid;
