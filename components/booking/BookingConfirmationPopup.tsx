import { Dispatch, SetStateAction, useContext, FC, FormEvent, ChangeEvent } from 'react'
import {
  Box,
  Button,
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
  useToast,
} from '@chakra-ui/react'
import format from 'date-fns/format'
import { BookingsContext, BookingsContextValue } from '../../pages/BookingsContext'

type BookingConfirmationPopupProps = {
  onClose: () => void
  isOpen: boolean
  bookingDataFromSelection: BookingDataSelection
  startDate: Date
  unsuccessfulFormSubmitString: string
  setUnsuccessfulFormSubmitString: Dispatch<SetStateAction<string>>
  bookingData: BookingDataForm
  setBookingData: Dispatch<SetStateAction<BookingDataForm>>
  auth: AuthState
  refreshData: () => void
}

export const BookingConfirmationPopup: FC<BookingConfirmationPopupProps> = ({
  onClose,
  isOpen,
  bookingDataFromSelection,
  startDate,
  unsuccessfulFormSubmitString,
  setUnsuccessfulFormSubmitString,
  bookingData,
  setBookingData,
  auth,
  refreshData,
}) => {
  const bookingsContextValue: BookingsContextValue = useContext(BookingsContext)
  const toast = useToast()
  const toast_id = 'response-toast'

  const getOrgNameFromId = (orgId: number) => {
    return bookingsContextValue.allOrgs.find((o) => o.id === orgId)?.name || ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUnsuccessfulFormSubmitString('')
    const token = auth?.token
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ ...bookingData, ...bookingDataFromSelection }),
    }
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings', requestOptions)
    const data = await response.json()
    if (response.status === 400) {
      setUnsuccessfulFormSubmitString(JSON.stringify(data.message))
    } else if (response.status === 200) {
      toast({
        id: toast_id,
        title: `Booking made successfully!`,
        position: 'top',
        duration: 3000,
        status: 'success',
        isClosable: true,
      })
      onClose()
      refreshData()
    } else {
      toast({
        id: toast_id,
        title: JSON.stringify(data.message),
        position: 'top',
        duration: 3000,
        status: 'error',
        isClosable: true,
      })
      onClose()
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue =
      event.target.name === 'orgId' ? parseInt(event.target.value) : event.target.value
    setBookingData((prevData) => ({
      ...prevData,
      [event.target.name]: newValue,
    }))
  }

  if (!auth || auth.token === '' || auth.orgIds.length === 0 || !bookingDataFromSelection) {
    return <></>
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
                  value={bookingData.orgId}
                  name='orgId'
                  aria-label='Organisation'
                  onChange={handleInputChange}
                  required
                >
                  <option key={0} value={auth.orgIds[0]}>
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
                      )
                    })}
                </Select>
              }
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='event' marginTop='0.5rem'>
                Event
              </FormLabel>
              <Input
                id='event'
                name='event'
                aria-label='Event'
                onBlur={handleInputChange}
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
              <Button
                type='submit'
                marginTop='1rem'
                width='fit-content'
                borderRadius='0.2rem'
                variant='success'
              >
                Confirm booking
              </Button>
            </FormControl>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
