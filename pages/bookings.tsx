import type {NextPage} from "next";
import React, {Dispatch, SetStateAction, useState} from "react";
import NavMenu from "../components/NavMenu";
import {Box, Flex, FormLabel, Grid, GridItem, HStack, Input, Select, Text} from '@chakra-ui/react';
import Footer from '../components/Footer';
import ScheduleSelector from 'react-schedule-selector';
import {SingleDatepicker} from "chakra-dayzed-datepicker";

const venues = ['CPTH', 'Chatterbox', 'Maker\'s Studio', 'Amphi', 'TRR', 'TRB'];

interface VenueBookingProps {
    venue: string
    isTimeLabelsDisplayed: boolean
    startDate: Date
}

type bookingInfo = {
    ig: string,
    venue: string,
    bookedBy: string,
    from: number,
    to: number,
}

const bookings: bookingInfo[] = [
    {
        ig: "Hacks",
        venue: "CPTH",
        bookedBy: "IG Head",
        from: 1673506685,
        to: 1673521085,
    },
]

/*
   {
    ig: "Second",
    venue: "CPTH",
    bookedBy: "IG Head",
    from: 1673524685,
    to: 1673524985,
  }
 */
const Switcher: React.FC = () => {
    const [isDisplayByDay, setIsDisplayByDay] = useState<boolean>(true);
    return (
        <FormLabel
            htmlFor="theme-switcher"
            as={"label"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            // gap={2}
            position="relative"
        >
            <Input
                id="theme-switcher"
                type="checkbox"
                checked={true}
                onChange={() => setIsDisplayByDay(!isDisplayByDay)}
                display="inline-block"
                appearance="none"
                cursor="pointer"
                // height="24px"
                // width="48px"
                backgroundColor="blue.50"
                border="1px solid"
                borderColor="blue.200"
                borderRadius="full"
            />
            <Box
                className={`iconMove `}
                transition="all 0.2s ease-in"
                transform={isDisplayByDay ? "translateX(0)" : "translateX(24px)"}
                position="absolute"
                cursor="pointer"
                // top={"1px"}
                // left={"1px"}
                // w={"22px"}
                // h={"22px"}
                bg="blue.900"
                borderRadius="full"
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

    return <ScheduleSelector
        startDate={new Date(props.startDate)}
        selection={schedule}
        numDays={1}
        bookings={bookings.filter(x => x.venue === props.venue)}
        minTime={0}
        maxTime={23.5}
        timeFormat="HH:mm"
        dateFormat="DD/MM"
        hourlyChunks={2}
        onChange={(newSchedule: Array<Date>) => {
            setSchedule(newSchedule)
        }}
        isTimeLabelsDisplayed={false}
        // isTimeLabelsDisplayed={props.isTimeLabelsDisplayed}
        isRenderVenueLabel={true}
        venues={[props.venue]}
    />
}

const DateAndVenueSelection: React.FC<{ startDate: Date, setStartDate: Dispatch<SetStateAction<Date>> }>
    = ({startDate, setStartDate}) => {
    return (
        <HStack align='flex-start' alignItems="center" justifyContent={"center"}>
            <Switcher/>
            <Box maxWidth={'125px'}>
                <SingleDatepicker
                    name="date-input"
                    date={startDate}
                    onDateChange={setStartDate}
                />
            </Box>
            <Select variant='flushed' placeholder={venues[0]}>
                {venues.map(venue => <option key={venue} value={venue}>{venue}</option>)}
            </Select>
        </HStack>
    );
}

const BookingTimes: React.FC = () => {
    const [schedule, setSchedule] = useState<Date[]>([]);

    return (<ScheduleSelector
        startDate={new Date()}
        selection={schedule}
        numDays={1}
        bookings={bookings.filter(x => false)}
        minTime={0}
        maxTime={23.5}
        timeFormat="HH:mm"
        dateFormat="DD/MM"
        hourlyChunks={2}
        onChange={(newSchedule: Array<Date>) => {
            setSchedule(newSchedule)
        }}
        isTimeLabelsDisplayed={true}
        isRenderVenueLabel={true}
        renderDateCell={(datetime: Date, selected: boolean, refSetter: (dateCellElement: HTMLElement) => void): JSX.Element => {
            return <div style={{width: "0%", height: '25px'}}/>
        }}
        renderVenueCell={(venueName: string): JSX.Element => {
            return (<span>x</span>)
        }}
        venues={["x"]}
    />)
}

const BookingSelector: React.FC = () => {
    const [startDate, setStartDate] = React.useState<Date>(new Date())

    return (
        <>
            <DateAndVenueSelection startDate={startDate} setStartDate={setStartDate}/>
                <HStack>
                    <BookingTimes/>
                    {venues.map((venue, index) => {
                        return (<VenueBooking key={venue}
                                              venue={venue} isTimeLabelsDisplayed={index == 0} startDate={startDate}/>)
                    })}
                </HStack>
        </>
    );
}

const Bookings: NextPage = () => {
    return (
        <Flex
            justify="center"
            flexDir="column"
            as="main"
        >
            <NavMenu/>
            <BookingSelector/>
            <Footer/>
        </Flex>
    );
};

export default Bookings;
