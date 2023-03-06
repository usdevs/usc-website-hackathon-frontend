import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

type BookingConfirmationPopupProps = {
  onClosePopup: (show: boolean) => void;
};

function generateHourOptions() {
  const hours = Array.from(Array(12).keys());
  const amOptions = hours.map((hour) => (
    <React.Fragment key={`${hour}:00am`}>
      <option>{`${hour}:00am`}</option>
      <option>{`${hour}:30am`}</option>
    </React.Fragment>
  ));
  const pmOptions = hours.map((hour) => (
    <React.Fragment key={`${hour}:00pm`}>
      <option>{`${hour}:00pm`}</option>
      <option>{`${hour}:30pm`}</option>
    </React.Fragment>
  ));

  return [...amOptions, ...pmOptions];
}

export const BookingConfirmationPopup: React.FC<BookingConfirmationPopupProps> = ({
  onClosePopup,
}) => {

    const [bookingData, setBookingData] = useState({
        name: "",
        organisation: "",
        event: "",
        telehandle: "",
        date: "",
        startTime: "",
        endTime: "",
    });

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(bookingData);
        onClosePopup(false);
        setBookingData({
            name: "",
            organisation: "",
            event: "",
            telehandle: "",
            date: "",
            startTime: "",
            endTime: "",
        });
    }, [bookingData]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBookingData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value,
        }));
    }, []);

    

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      position="fixed"
      zIndex="1"
      width="100vw"
      height="100vh"
      bg="rgba(14, 14, 14, 0.8)"
      top="0"
    >
      <Box width="30rem" overflow="auto" maxHeight="100vh">
        <Flex color="white" bg="#1f407b" fontSize="1.1rem" alignItems="center">
          <Button
            bg="#1f407b"
            _hover={{
              background: "none",
              color: "#c9c9c9",
            }}
            _active={{
                background: "none",
                color: "#c9c9c9",
            }}
            onClick={() => onClosePopup(false)}
          >
            X
          </Button>
          <Box>NEW BOOKING</Box>
        </Flex>
        <form onSubmit={handleSubmit} style={{backgroundColor:"white", padding:"1rem"}}>
            <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input name="name" id="name" aria-label="Name" onChange={handleInputChange} required  />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="organisation" marginTop="0.5rem">Organisation</FormLabel>
                <Input id="organisation" name="organisation" aria-label="Organisation" onChange={handleInputChange} required />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="event" marginTop="0.5rem">Event</FormLabel>
                <Input id="event" name="event" aria-label="Event" onChange={handleInputChange} required />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="telehandle" marginTop="0.5rem">Telehandle</FormLabel>
                <Input id="telehandle" name="telehandle" aria-label="Telehandle" onChange={handleInputChange} required />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="date" marginTop="0.5rem">Date</FormLabel>
                <Input id="date" type="date" name="date" aria-label="Telehandle" onChange={handleInputChange} required />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="startTime" marginTop="0.5rem">Start Time</FormLabel>
                <Select id="startTime" name="startTime" aria-label="Start Time" onChange={handleInputChange} required >
                    {generateHourOptions()}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="endTime" marginTop="0.5rem">End Time</FormLabel>
                <Select id="endTime" name="endTime" aria-label="End Time" onChange={handleInputChange} required >
                    {generateHourOptions()}
                </Select>
            </FormControl>
            <FormControl>
                <Input
                    type="submit"
                    marginTop="1rem"
                    bg="#66cc99"
                    _hover={{ bg: "#e53e3e", color:"#fff" }}
                    width="fit-content"
                    borderRadius="0.2rem"
                    cursor="pointer"
                    value="Confirm Booking"
                />
            </FormControl>
        </form>
      </Box>
    </Flex>
  );
};
