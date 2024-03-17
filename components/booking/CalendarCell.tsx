import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { format } from 'date-fns'

import { getVenueFromId } from '@/utils/booking'

import { BookingDataDisplay } from '@/types/bookings.types'

import { useAllVenues } from '@/hooks/useAllVenues'

interface CellProps {
  text: string
  isExpanded: boolean
  isSelected: boolean
  onClick?: () => void
  bookings: Array<BookingDataDisplay>
}

const spring = {
  type: 'spring',
  damping: 50,
  stiffness: 300,
}

const CalendarCell: React.FC<CellProps> = ({ text, isExpanded, isSelected, onClick, bookings }) => {
  const [allVenues, isLoadingVenues] = useAllVenues()

  const { isOpen, onOpen, onClose } = useDisclosure()

  if (isLoadingVenues) {
    return <></>
  }

  return (
    <>
      <Center
        zIndex='10'
        color={isSelected ? 'white' : 'black'}
        bgColor={isSelected ? '#1f407b' : 'white'}
        fontWeight={isSelected ? 'bold' : 'normal'}
        height={12}
        width={12}
        onClick={onClick}
      >
        <Text>{text}</Text>
        {isExpanded && (
          <div style={{ height: '75%' }}>
            <VStack alignItems='flex-start' spacing='0' pl='4' height='100%'>
              {bookings.slice(0, 3).map((booking, i) => {
                return (
                  <div key={i}>
                    <Text w='100%' fontWeight='normal' fontSize='sm' textAlign='left'>
                      {`${format(booking.from, 'HH:mm')}-${format(booking.to, 'HH:mm')} ${
                        getVenueFromId(allVenues, booking.venueId).name
                      }`}
                    </Text>
                  </div>
                )
              })}
              {bookings.length > 3 ? (
                <div>
                  <Text
                    role='button'
                    w='100%'
                    fontWeight='normal'
                    fontSize='xs'
                    textAlign='left'
                    cursor='pointer'
                    color={isSelected ? '#e19c3d' : '#1f407b'}
                    _hover={{ textDecoration: 'underline' }}
                    onClick={onOpen}
                  >
                    {bookings.length - 3} more
                  </Text>
                </div>
              ) : (
                <></>
              )}
            </VStack>
          </div>
        )}
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bookings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {bookings.map((booking, i) => {
              return (
                <Text key={i} w='100%' fontWeight='normal' fontSize='sm' textAlign='left'>
                  {`${format(booking.from, 'HH:mm')}-${format(booking.to, 'HH:mm')} ${
                    getVenueFromId(allVenues, booking.venueId).name
                  }`}
                </Text>
              )
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CalendarCell
