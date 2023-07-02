import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  Box,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { getVenueFromId } from '../../utils'
import { useAllVenues } from '../../hooks/useAllVenues'

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

  const list = {
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
      },
    },
  }

  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 },
  }

  if (isLoadingVenues) {
    return <></>
  }

  return (
    <motion.div
      style={{
        textAlign: 'center',
        cursor: text !== '' ? 'pointer' : 'default',
        position: 'relative',
      }}
      animate={{
        opacity: 1,
        height: isExpanded ? '14vh' : '50px',
        width: isExpanded ? '13vw' : '50px',
        transition: spring,
      }}
      onClick={onClick}
    >
      <Box
        zIndex='10'
        color={isSelected ? 'white' : 'black'}
        fontWeight={isSelected ? 'bold' : 'normal'}
        height='100%'
      >
        <Text>{text}</Text>
        {isExpanded && (
          <motion.div initial='hidden' animate='visible' variants={list} style={{ height: '75%' }}>
            <VStack alignItems='flex-start' spacing='0' pl='4' height='100%'>
              {bookings.slice(0, 3).map((booking, i) => {
                return (
                  <motion.div variants={item} key={i}>
                    <Text w='100%' fontWeight='normal' fontSize='sm' textAlign='left'>
                      {`${format(booking.from, 'HH:mm')}-${format(booking.to, 'HH:mm')} ${
                        getVenueFromId(allVenues, booking.venueId).name
                      }`}
                    </Text>
                  </motion.div>
                )
              })}
              {bookings.length > 3 ? (
                <motion.div variants={item}>
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
                </motion.div>
              ) : (
                <></>
              )}
            </VStack>
          </motion.div>
        )}
      </Box>
      {isSelected && (
        <motion.div
          style={{
            position: 'absolute',
            height: isExpanded ? '14vh' : '50px',
            width: isExpanded ? '13vw' : '50px',
            bottom: isExpanded ? '0' : '25%',
            borderRadius: '15px',
            background: '#1F407B',
            opacity: 0.85,
            zIndex: -1,
          }}
          transition={{
            duration: 0.5,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          layoutId='underline'
        />
      )}
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
    </motion.div>
  )
}

export default CalendarCell
