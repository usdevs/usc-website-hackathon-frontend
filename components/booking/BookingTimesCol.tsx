import { VStack, Center, Text, Box } from '@chakra-ui/react';
import { eachMinuteOfInterval, format } from 'date-fns';

type BookingTimesProps = {
  boxHeight: number;
};

// Labels for time 0000-2330
const BookingsTimesCol: React.FC<BookingTimesProps> = ({ boxHeight }) => {
  // Format the time intervals into strings
  const timeStrings = eachMinuteOfInterval(
    {
      start: new Date(2000, 1, 1, 0), // Start at 0000
      end: new Date(2000, 1, 1, 23, 59), // End at 2359
    },
    { step: 30 },
  ).map((el) => format(el, 'HH:mm'));

  return (
    <VStack spacing='0'>
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
        {timeStrings.map((el, i) => (
          <Center
            h={boxHeight}
            key={el}
            boxSizing='content-box'
            borderY='solid .2rem'
            borderColor='white'
          >
            {/* Ensures time labels are aligned with grid cells */}
            <Box>{el}</Box>
          </Center>
        ))}
      </VStack>
    </VStack>
  );
};

export default BookingsTimesCol;
