import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseToastOptions,
  VStack,
  useToast,
} from '@chakra-ui/react'
import format from 'date-fns/format'
import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { KeyedMutator } from 'swr'
import useSWRImmutable from 'swr/immutable'
import * as Yup from 'yup'

import { checkIsVenueAdmin } from '@/utils/auth'
import {
  getFromUrlStringAndParseJson,
  getVenueFromId,
  isUserLoggedIn,
  makeFetchToUrlWithAuth,
} from '@/utils/booking'

import { AuthState } from '@/types/auth.types'
import { BookingDataBackend, BookingDataSelection, Organisation } from '@/types/bookings.types'
import { SelectProps } from '@/types/form.types'

import { useAllVenues } from '@/hooks/useAllVenues'
import { useCurrentHalfHourTime } from '@/hooks/useCurrentHalfHourTime'
import { useUserInfo } from '@/hooks/useUserInfo'

import FormSelect from '../form/FormSelect'
import FormTextField from '../form/FormTextField'

const MAX_SLOTS_PER_BOOKING = 4

type BookingConfirmationPopupProps = {
  onClose: () => void
  isOpen: boolean
  bookingDataFromSelection: BookingDataSelection
  startDate: Date
  mutate: KeyedMutator<BookingDataBackend[]>
}

type OrgDropdownProps = {
  isVenueAdmin: boolean
  auth: AuthState
  allOrgs: Organisation[]
}

const BOOKING_TOAST_ID = 'booking-toast'
const DURATION_PER_SLOT = 30

const makeSuccessBookingToast = (id = BOOKING_TOAST_ID): UseToastOptions => {
  return {
    id,
    title: `Booking made successfully!`,
    position: 'top',
    duration: 3000,
    status: 'success',
    isClosable: true,
  }
}

const makeInvalidBookingToast = (errMsg: string, id = BOOKING_TOAST_ID): UseToastOptions => {
  return {
    id,
    title: `Oops! The booking couldn't be made.`,
    description: errMsg,
    position: 'top',
    duration: 5000,
    status: 'warning',
    isClosable: true,
  }
}

const makeErrorBookingToast = (errMsg: string, id = BOOKING_TOAST_ID): UseToastOptions => {
  return {
    id,
    title: 'Oh snap! There was an error when making the booking',
    description: errMsg,
    position: 'top',
    duration: 5000,
    status: 'error',
    isClosable: true,
  }
}

const validationSchema = Yup.object().shape({
  eventName: Yup.string().required('Event name cannot be empty'),
  orgId: Yup.number().required('Organisation ID cannot be empty'),
})

type BookingForm = Yup.InferType<typeof validationSchema>

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
  const [auth] = useUserInfo()

  // todo do better than querying all orgs just to match bookings here <-- search orgs in DB by orgId with GraphQL
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isUserLoggedIn(auth)) {
    return <></>
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

  const isVenueAdmin = checkIsVenueAdmin(auth, bookingDataFromSelection.venueId)

  if (
    !isVenueAdmin &&
    bookingDataFromSelection.end.getTime() - bookingDataFromSelection.start.getTime() >
      DURATION_PER_SLOT * MAX_SLOTS_PER_BOOKING * 1000 * 60
  ) {
    if (toast.isActive(BOOKING_TOAST_ID)) return <></>
    toast(
      makeInvalidBookingToast(
        JSON.stringify('Booking duration is too long, please change your booking request'),
      ),
    )
    return <></>
  }

  const orgIdsSet = new Set(auth.orgIds)
  const orgs = isVenueAdmin ? allOrgs : allOrgs.filter((org) => orgIdsSet.has(org.id))
  const orgSelectProps: SelectProps<number>[] = orgs.map((org) => ({
    label: org.name,
    value: org.id,
  }))

  const defaultOrg = orgSelectProps[0].value
  const initialValues = {
    eventName: '',
    orgId: defaultOrg,
  } satisfies BookingForm

  const handleSubmit = async (values: BookingForm) => {
    // Fallback to prevent double submission
    if (isSubmitting) {
      onClose()
      return
    }

    setIsSubmitting(true)
    try {
      const { responseJson, responseStatus } = await makeFetchToUrlWithAuth(
        process.env.NEXT_PUBLIC_BACKEND_URL + 'bookings',
        auth.token,
        'POST',
        JSON.stringify({ ...values, ...bookingDataFromSelection }),
      )

      if (responseStatus === 200) {
        if (!toast.isActive(BOOKING_TOAST_ID)) {
          toast(makeSuccessBookingToast('booking-success'))
        }
        await mutate(undefined)
        onClose()
      } else if (responseStatus === 400) {
        if (toast.isActive(BOOKING_TOAST_ID)) return
        toast(makeInvalidBookingToast(JSON.stringify(responseJson.message), 'booking-invalid'))
      } else {
        if (toast.isActive(BOOKING_TOAST_ID)) return
        toast(makeErrorBookingToast(JSON.stringify(responseJson.message), 'booking-error'))
      }
    } catch (err) {
      const message = (err as Error).message
      toast(makeErrorBookingToast(message, message))
    }

    setIsSubmitting(false)
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(form) => {
              return (
                <Form>
                  <VStack align='start' spacing={2} p='1rem'>
                    <FormTextField
                      type='text'
                      id='eventName'
                      name='eventName'
                      label='Event'
                      form={form}
                      field={form.getFieldProps('eventName')}
                    />
                    <FormSelect
                      id='orgId'
                      name='orgId'
                      label='Organisation'
                      form={form}
                      field={form.getFieldProps('orgId')}
                      defaultValue={defaultOrg}
                      placeholder='Select an organisation...'
                      data={orgSelectProps}
                    />
                    <FormControl>
                      <FormLabel htmlFor='venue' marginTop='0.5rem'>
                        Venue
                      </FormLabel>
                      <Box>
                        {isOpen
                          ? getVenueFromId(allVenues, bookingDataFromSelection.venueId).name
                          : ''}
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
                      <Box>
                        {format(bookingDataFromSelection.start || currentRoundedHalfHourTime, 'p')}
                      </Box>
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor='end' marginTop='0.5rem'>
                        End Time
                      </FormLabel>
                      <Box>
                        {format(bookingDataFromSelection.end || currentRoundedHalfHourTime, 'p')}
                      </Box>
                    </FormControl>
                    <Button type='submit' colorScheme='teal' mt={4} isLoading={form.isSubmitting}>
                      Submit
                    </Button>
                  </VStack>
                </Form>
              )
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
