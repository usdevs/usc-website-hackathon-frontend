import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import format from 'date-fns/format';
import { useLocalStorage } from './swr-internal-state-main';

type BookingConfirmationPopupProps = {
  onClose: () => void;
  isOpen: boolean;
  bookingDataFromSelection: BookingDataFromSelection;
  startDate: Date;
  unsuccessfulFormSubmitString: string;
  setUnsuccessfulFormSubmitString: Dispatch<SetStateAction<string>>;
};

const useUserInfo = () => useLocalStorage<AuthState>('token-value', { token: '' });

export const BookingConfirmationPopup: React.FC<BookingConfirmationPopupProps> = ({
  onClose,
  isOpen,
  bookingDataFromSelection,
  startDate,
  unsuccessfulFormSubmitString,
  setUnsuccessfulFormSubmitString,
}) => {
  const [bookingData, setBookingData] = useState({
    event: '',
    orgId: 1,
  });
  const toast = useToast();
  const toast_id = 'auth-toast';
  const [auth] = useUserInfo();

  if (auth?.token === '') {
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
  }

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setUnsuccessfulFormSubmitString('');
      const token = auth?.token;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        //todo fix
        body: JSON.stringify({ ...bookingData, ...bookingDataFromSelection, venueId: 1 }),
      };
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings',
        requestOptions,
      );
      const data = await response.json();
      if (data?.status === 400) {
        setUnsuccessfulFormSubmitString(JSON.stringify(data.message));
      } else {
        onClose();
        setBookingData({
          event: '',
          orgId: 1,
        });
      }
      //todo handle error
    },
    [bookingData],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setBookingData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value,
      }));
    },
    [],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} returnFocusOnClose={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='white' bg='#1f407b' fontSize='1.1rem' alignItems='center'>
          NEW BOOKING
        </ModalHeader>
        <ModalCloseButton
          bg='white'
          _hover={{
            background: 'none',
            color: '#c9c9c9',
          }}
          _active={{
            background: 'none',
            color: '#c9c9c9',
          }}
        />
        <ModalBody>
          {unsuccessfulFormSubmitString === '' ? (
            <></>
          ) : (
            <Box>{'Errors in form submission: ' + unsuccessfulFormSubmitString}</Box>
          )}
          <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '1rem' }}>
            <FormControl>
              <FormLabel htmlFor='organisation' marginTop='0.5rem'>
                Organisation
              </FormLabel>
              <Input
                id='organisation'
                name='organisation'
                aria-label='Organisation'
                onChange={handleInputChange}
                required
              />
              {/*<Select id="startTime" name="startTime" aria-label="Start Time" onChange={handleInputChange} required>*/}
              {/*  {generateHourOptions()}*/}
              {/*</Select>*/}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='event' marginTop='0.5rem'>
                Event
              </FormLabel>
              <Input
                id='event'
                name='event'
                aria-label='Event'
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='venue' marginTop='0.5rem'>
                Venue
              </FormLabel>
              <Box>{bookingDataFromSelection?.venue}</Box>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='date' marginTop='0.5rem'>
                Date
              </FormLabel>
              <Box>{format(startDate, 'PPP')}</Box>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='start' marginTop='0.5rem'>
                Start Time
              </FormLabel>
              <Box>{format(bookingDataFromSelection?.start || new Date(), 'p')}</Box>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='end' marginTop='0.5rem'>
                End Time
              </FormLabel>
              <Box>{format(bookingDataFromSelection?.end || new Date(), 'p')}</Box>
            </FormControl>
            <FormControl>
              <Input
                type='submit'
                marginTop='1rem'
                bg='#66cc99'
                _hover={{ bg: '#e53e3e', color: '#fff' }}
                width='fit-content'
                borderRadius='0.2rem'
                cursor='pointer'
                value='Confirm Booking'
              />
            </FormControl>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
