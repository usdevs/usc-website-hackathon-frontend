import type { NextPage } from 'next';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import NavMenu from '../components/NavMenu';
import { Box, Flex, FormLabel, HStack, Input, Select, Text, useDisclosure } from '@chakra-ui/react';
import Footer from '../components/Footer';
import ScheduleSelector from '../components/lib';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { BookingConfirmationPopup } from '../components/BookingConfirmationPopup';
import { useContext } from 'react';
import { BookingsContext } from './BookingsContext';

const venues = ['CTPH', 'Chatterbox', "Maker's Studio", 'Amphi', 'TRR', 'TRB'];

const Switcher: React.FC = () => {
  const [isDisplayByDay, setIsDisplayByDay] = useState<boolean>(true);
  return (
    <FormLabel
      htmlFor='theme-switcher'
      as={'label'}
      display='flex'
      alignItems='center'
      justifyContent='center'
      // gap={2}
      position='relative'
    >
      <Input
        id='theme-switcher'
        type='checkbox'
        checked={true}
        onChange={() => setIsDisplayByDay(!isDisplayByDay)}
        display='inline-block'
        appearance='none'
        cursor='pointer'
        // height="24px"
        // width="48px"
        backgroundColor='blue.50'
        border='1px solid'
        borderColor='blue.200'
        borderRadius='full'
      />
      <Box
        className={`iconMove `}
        transition='all 0.2s ease-in'
        transform={isDisplayByDay ? 'translateX(0)' : 'translateX(24px)'}
        position='absolute'
        cursor='pointer'
        // top={"1px"}
        // left={"1px"}
        // w={"22px"}
        // h={"22px"}
        bg='blue.900'
        borderRadius='full'
      >
        <Text
        // as={isDisplayByDay ? BsSunFill : BsFillMoonFill}
        // padding="2px"
        // w={"22px"}
        // h={"22px"}
        >
          {isDisplayByDay ? 'Day' : 'Month'}
        </Text>
      </Box>
    </FormLabel>
  );
};

//trying to figure out how to render these bookigns and empty booking together from propss, can use computeDateMatrix
const VenueBooking: React.FC<VenueBookingProps> = (props: VenueBookingProps) => {
  const [schedule, setSchedule] = useState<Date[]>([]);
  const [bookings, setBookings] = useState<BookingInfoToDisplay[]>([]);
  const bookingsFromBackend: BackendBookingInfo[] = useContext(BookingsContext);

  useEffect(() => {
    setBookings(
      bookingsFromBackend
        .map((x) => {
          return {
            ig: x.orgId.toString(),
            venue: 'CTPH', //x.venueId.toString(),
            bookedBy: x.userId.toString(),
            from: Date.parse(x.start),
            to: Date.parse(x.end),
          };
        })
        .filter((x) => x.venue === props.venue),
    );
  }, [bookingsFromBackend]);

  return (
    <ScheduleSelector
      startDate={new Date(props.startDate)}
      selection={schedule}
      numDays={1}
      bookings={bookings}
      minTime={0}
      maxTime={23.5}
      timeFormat='HH:mm'
      dateFormat='DD/MM'
      hourlyChunks={2}
      onChange={(newSchedule: Array<Date>) => {
        setSchedule(newSchedule);
        props.setBookingDataFromSelection({
          ...props.bookingDataFromSelection,
          venueId: 1,
          venue: props.venue,
        });
        props.onOpen();
      }}
      bookingDataFromSelection={props.bookingDataFromSelection}
      setBookingDataFromSelection={props.setBookingDataFromSelection}
      isTimeLabelsDisplayed={false}
      // isTimeLabelsDisplayed={props.isTimeLabelsDisplayed}
      isRenderVenueLabel={true}
      venues={[props.venue]}
    />
  );
};

const DateAndVenueSelection: React.FC<{
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
}> = ({ startDate, setStartDate }) => {
  return (
    <HStack align='flex-start' alignItems='center' justifyContent={'center'}>
      {/*<Switcher />*/}
      <Box maxWidth={'125px'}>
        <SingleDatepicker name='date-input' date={startDate} onDateChange={setStartDate} />
      </Box>
      {/*<Select variant="flushed" placeholder={venues[0]}>*/}
      {/*    {venues.map(venue => <option key={venue} value={venue}>{venue}</option>)}*/}
      {/*</Select>*/}
    </HStack>
  );
};

const BookingTimes: React.FC = () => {
  const [schedule, setSchedule] = useState<Date[]>([]);

  return (
    <ScheduleSelector
      startDate={new Date()}
      selection={schedule}
      numDays={1}
      bookings={[]}
      minTime={0}
      maxTime={23.5}
      timeFormat='HH:mm'
      dateFormat='DD/MM'
      hourlyChunks={2}
      onChange={(newSchedule: Array<Date>) => {
        setSchedule(newSchedule);
      }}
      isTimeLabelsDisplayed={true}
      isRenderVenueLabel={true}
      renderDateCell={(
        datetime: Date,
        selected: boolean,
        refSetter: (dateCellElement: HTMLElement) => void,
      ): JSX.Element => {
        return <div style={{ width: '0px', height: '25px' }} />;
      }}
      renderVenueLabel={(venueName: string): JSX.Element => {
        return <span>Times</span>;
      }}
      venues={['Times']}
    />
  );
};
const BookingSelector: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bookingDataFromSelection, setBookingDataFromSelection] =
    useState<BookingDataFromSelection>({
      start: null,
      end: null,
      venueId: 1,
      venue: '',
    });
  const [unsuccessfulFormSubmitString, setUnsuccessfulFormSubmitString] = useState<string>('');
  const onModalClose = () => {
    setUnsuccessfulFormSubmitString('');
    onClose();
  };

  return (
    <>
      <BookingConfirmationPopup
        isOpen={isOpen}
        onClose={onModalClose}
        startDate={startDate}
        setUnsuccessfulFormSubmitString={setUnsuccessfulFormSubmitString}
        unsuccessfulFormSubmitString={unsuccessfulFormSubmitString}
        bookingDataFromSelection={bookingDataFromSelection}
      />
      <DateAndVenueSelection startDate={startDate} setStartDate={setStartDate} />
      <HStack>
        <BookingTimes />
        {venues.map((venue, index) => {
          return (
            <VenueBooking
              key={venue}
              onOpen={onOpen}
              bookingDataFromSelection={bookingDataFromSelection}
              setBookingDataFromSelection={setBookingDataFromSelection}
              venue={venue}
              isTimeLabelsDisplayed={index == 0}
              startDate={startDate}
            />
          );
        })}
      </HStack>
    </>
  );
};

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
  );
};

export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings?userId=1');
  const currentUserBookings = await res.json();
  return { props: { currentUserBookings } };
}
export default Bookings;
