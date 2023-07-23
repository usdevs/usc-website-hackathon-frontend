import { FC, FormEvent, ChangeEvent, useState } from 'react'
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
  UseToastOptions,
  useToast,
} from '@chakra-ui/react'
import format from 'date-fns/format'
import {
  throwsErrorIfNullOrUndefined,
  isUserLoggedIn,
  getOrgFromId,
  getVenueFromId,
  getFromUrlStringAndParseJson,
  makeFetchToUrlWithAuth,
} from '../../utils'
import { useCurrentHalfHourTime } from '../../hooks/useCurrentHalfHourTime'
import { useUserInfo } from '../../hooks/useUserInfo'
import useSWRImmutable from 'swr/immutable'
import { useAllVenues } from '../../hooks/useAllVenues'
import { KeyedMutator } from 'swr'

const MAX_SLOTS_PER_BOOKING = 4

type BookingConfirmationPopupProps = {
  onClose: () => void
  isOpen: boolean
  bookingDataFromSelection: BookingDataSelection
  startDate: Date
  mutate: KeyedMutator<BookingDataBackend[]>
}

const BOOKING_TOAST_ID = 'booking-toast'
const DURATION_PER_SLOT = 30

const makeSuccessBookingToast = (): UseToastOptions => {
  return {
    id: BOOKING_TOAST_ID,
    title: `Booking made successfully!`,
    position: 'top',
    duration: 3000,
    status: 'success',
    isClosable: true,
  }
}

const makeInvalidBookingToast = (errMsg: string): UseToastOptions => {
  return {
    id: BOOKING_TOAST_ID,
    title: `Oops! The booking couldn't be made.`,
    description: errMsg,
    position: 'top',
    duration: 5000,
    status: 'warning',
    isClosable: true,
  }
}

const makeErrorBookingToast = (errMsg: string): UseToastOptions => {
  return {
    id: BOOKING_TOAST_ID,
    title: 'Oh snap! There was an error when making the booking',
    description: errMsg,
    position: 'top',
    duration: 5000,
    status: 'error',
    isClosable: true,
  }
}

export const BookingConfirmationPopup: FC<BookingConfirmationPopupProps> = ({
  onClose,
  isOpen,
  bookingDataFromSelection,
  startDate,
  mutate,
}) => {
  const {
    data: allOrgs = [],
    error,
    isLoading: isLoadingOrgs,
  } = useSWRImmutable<Organisation[], string>(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs',
    getFromUrlStringAndParseJson,
  )
  const [allVenues, isLoadingVenues] = useAllVenues()
  const toast = useToast()
  const currentRoundedHalfHourTime = useCurrentHalfHourTime()
  const [authOrNull] = useUserInfo()
  const auth: AuthState = throwsErrorIfNullOrUndefined(authOrNull)
  const [bookingData, setBookingData] = useState<BookingDataForm>({
    eventName: '',
    orgId: auth ? auth.orgIds[0] : -1,
  })

  // todo do better than querying all orgs just to match bookings here <-- search orgs in DB by orgId with GraphQL

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Fallback to prevent double submission
    if (isSubmitting) {
      onClose()
      return
    }

    setIsSubmitting(true)

    const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
      process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings',
      auth.token,
      'POST',
      JSON.stringify({ ...bookingData, ...bookingDataFromSelection }),
    )

    if (responseStatus === 200) {
      toast(makeSuccessBookingToast())
      await mutate(undefined)
      onClose()
    } else if (responseStatus === 400) {
      toast(makeInvalidBookingToast(JSON.stringify(responseJson.message)))
    } else {
      toast(makeErrorBookingToast(JSON.stringify(responseJson.message)))
    }

    setIsSubmitting(false)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue =
      event.target.name === 'orgId' ? parseInt(event.target.value) : event.target.value
    setBookingData((prevData) => ({
      ...prevData,
      [event.target.name]: newValue,
    }))
  }

  if (error) {
    throw new Error('Unable to fetch organisations from the backend')
  }

  if (
    !isUserLoggedIn(auth) ||
    auth.orgIds.length === 0 ||
    !bookingDataFromSelection ||
    isLoadingOrgs ||
    isLoadingVenues
  ) {
    return <></>
  }

  if (
    !auth.isAdminUser &&
    bookingDataFromSelection.end.getTime() - bookingDataFromSelection.start.getTime() >
      DURATION_PER_SLOT * MAX_SLOTS_PER_BOOKING * 1000 * 60
  ) {
    toast(
      makeInvalidBookingToast(
        JSON.stringify('Booking duration is too long, please change your booking request'),
      ),
    )
    return <></>
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} returnFocusOnClose={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='white' bg='#1f407b' fontSize='1.1rem' alignItems='center'>
          Make a new booking
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
                  {...(auth.orgIds.length === 1 ? { pointerEvents: 'none' } : {})}
                >
                  <option key={0} value={auth.orgIds[0]}>
                    {getOrgFromId(allOrgs, auth.orgIds[0]).name}
                  </option>
                  {auth.orgIds
                    .slice(1)
                    .map((orgId) => getOrgFromId(allOrgs, orgId).name)
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
              <FormLabel htmlFor='eventName' marginTop='0.5rem'>
                Event
              </FormLabel>
              <Input
                id='eventName'
                name='eventName'
                aria-label='eventName'
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='venue' marginTop='0.5rem'>
                Venue
              </FormLabel>
              <Box>
                {isOpen ? getVenueFromId(allVenues, bookingDataFromSelection.venueId).name : ''}
              </Box>
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
              <Box>{format(bookingDataFromSelection.start || currentRoundedHalfHourTime, 'p')}</Box>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='end' marginTop='0.5rem'>
                End Time
              </FormLabel>
              <Box>{format(bookingDataFromSelection.end || currentRoundedHalfHourTime, 'p')}</Box>
            </FormControl>
            <FormControl>
              <Button
                type='submit'
                isLoading={isSubmitting}
                loadingText='Submitting'
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
