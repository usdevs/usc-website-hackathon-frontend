import React, {
  useCallback,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';
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
  Select,
} from '@chakra-ui/react';
import format from 'date-fns/format';
import { BookingsContext, BookingsContextValue } from '../pages/BookingsContext';

type BookingConfirmationPopupProps = {
  onClose: () => void;
  isOpen: boolean;
  bookingDataFromSelection: BookingDataSelection;
  startDate: Date;
  unsuccessfulFormSubmitString: string;
  setUnsuccessfulFormSubmitString: Dispatch<SetStateAction<string>>;
  bookingData: BookingDataForm;
  setBookingData: Dispatch<SetStateAction<BookingDataForm>>;
  auth: AuthState;
};

export const BookingConfirmationPopup: React.FC<BookingConfirmationPopupProps> = ({
  onClose,
  isOpen,
  bookingDataFromSelection,
  startDate,
  unsuccessfulFormSubmitString,
  setUnsuccessfulFormSubmitString,
  bookingData,
  setBookingData,
  auth,
}) => {
  const bookingsContextValue: BookingsContextValue = useContext(BookingsContext);

  const getOrgNameFromId = (orgId: number) => {
    return bookingsContextValue?.allOrgs.find((o) => o.id === orgId)?.name || '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUnsuccessfulFormSubmitString('');
    const token = auth?.token;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ ...bookingData, ...bookingDataFromSelection }),
    };
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings', requestOptions);
    const data = await response.json();
    if (data?.status === 400) {
      setUnsuccessfulFormSubmitString(JSON.stringify(data.message));
    } else {
      onClose();
    }
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setBookingData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value,
      }));
    },
    [],
  );

  if (!auth || auth.token === '' || auth.orgIds.length === 0 || !bookingDataFromSelection) {
    return <></>;
  }

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
              {
                <Select
                  id='orgId'
                  name='orgId'
                  aria-label='Organisation'
                  onChange={handleInputChange}
                  required
                >
                  <option key={0} selected value={auth.orgIds[0]}>
                    {getOrgNameFromId(auth.orgIds[0])}
                  </option>
                  {auth.orgIds
                    .slice(1)
                    .map(getOrgNameFromId)
                    .map((orgName, i) => {
                      return (
                        <option key={i + 1} value={auth.orgIds[i + 1]}>
                          {orgName}
                        </option>
                      );
                    })}
                </Select>
              }
            </FormControl>
            <Box>{bookingData.orgId}</Box>
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
              <Box>{bookingDataFromSelection?.venueName}</Box>
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
