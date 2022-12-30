import type {NextPage} from "next";
import React, { useState } from "react";
import NavMenu from "../components/NavMenu";
import {
    Box,
    Card,
    CardBody,
    Checkbox,
    CheckboxGroup,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    StackDivider,
    Stack
} from '@chakra-ui/react';
import Footer from '../components/Footer';
import ScheduleSelector from 'react-schedule-selector'

const BookingSelector: React.FC = () => {
    const [schedule, setSchedule] = useState<Date[]>([]);

    return (
        <ScheduleSelector
            selection={schedule}
            numDays={5}
            minTime={8}
            maxTime={22}
            hourlyChunks={2}
            onChange={() => setSchedule(schedule)}
        />
    );
}

// class BookingSelector extends React.Component {
//     // const [schedule, setSchedule] = useState<Date[]>([]);
//     state = { schedule = [] }
//
//     handleChange = (newSchedule: Array<Date>) => {
//         this.setState({ schedule: newSchedule })
//     }
//
//     render() {
//         return (
//             <ScheduleSelector
//                 selection={this.state.schedule}
//                 numDays={5}
//                 minTime={8}
//                 maxTime={22}
//                 hourlyChunks={2}
//                 onChange={this.handleChange}
//             />
//         )
//     }
// }

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
