import { VStack, Center, Text, Box } from '@chakra-ui/react'
import { eachMinuteOfInterval, format } from 'date-fns'
import {
  BOOKING_CELL_BORDER_Y_REM,
  BOOKING_CELL_HEIGHT_REM,
  useBookingCellStyles,
} from '../../utils'

// Labels for time 0000-2330
const BookingsTimesCol: React.FC = () => {
  const [rootFontSize] = useBookingCellStyles()
  // Format the time intervals into strings
  const timeStrings = eachMinuteOfInterval(
    {
      start: new Date(2000, 1, 1, 0), // Start at 0000
      end: new Date(2000, 1, 1, 23, 59), // End at 2359
    },
    { step: 30 },
  ).map((el) => format(el, 'HH:mm'))

  return (
    <VStack spacing='0' position='sticky' left='0' zIndex={10} bgColor={'white'}>
      <Text
        fontSize='md'
        position='sticky'
        top='0'
        py='1'
        px='2'
        bg='brand.primary'
        color='white'
        alignSelf='stretch'
        textAlign='center'
      >
        Time
      </Text>
      <VStack spacing='0'>
        {timeStrings.map((el) => (
          <Center
            h={BOOKING_CELL_HEIGHT_REM * (rootFontSize ?? 16) + 'px'}
            key={el}
            boxSizing='content-box'
            borderY={BOOKING_CELL_BORDER_Y_REM + 'rem solid'}
            borderColor='white'
          >
            {/* Ensures time labels are aligned with grid cells */}
            <Box>{el}</Box>
          </Center>
        ))}
      </VStack>
    </VStack>
  )
}

export default BookingsTimesCol
