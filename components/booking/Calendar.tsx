import { useState } from 'react';
import { Box, Button, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { format, startOfMonth, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface CellProps {
  text: string;
  isHeader?: boolean;
  isExpanded: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

interface CalendarProps extends ToggleProps {
  setStartDate: (date: Date) => void;
}

const spring = {
  type: 'spring',
  damping: 50,
  stiffness: 300,
};

const CalendarCell: React.FC<CellProps> = ({ text, isHeader, isExpanded, isSelected, onClick }) => {
  if (isHeader) {
    return (
      <motion.div
        style={{ textAlign: 'center', fontWeight: 'bold' }}
        animate={{
          opacity: 1,
          height: isExpanded ? '70px' : '50px',
          width: isExpanded ? '10vw' : '50px',
          transition: spring,
        }}
      >
        {text}
      </motion.div>
    );
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
      <Text
        zIndex='10'
        color={isSelected ? 'white' : 'black'}
        fontWeight={isSelected ? 'bold' : 'normal'}
      >
        {text}
      </Text>
      {isSelected && (
        <motion.div
          style={{
            position: 'absolute',
            height: isExpanded ? '14vh' : '50px',
            width: isExpanded ? '13vw' : '50px',
            bottom: isExpanded ? '10%' : '25%',
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
    </motion.div>
  );
};

const Calendar: React.FC<CalendarProps> = ({ isOn, setStartDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selected, setSelected] = useState(selectedDate.getDate());

  const handlePrevMonth = () => {
    setSelected(-1);
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelected(-1);
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const monthYearLabel = format(selectedDate, 'MMM yyyy');
  const daysInMonth = Array.from(
    { length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1,
  );
  const firstDayOfMonth = startOfMonth(selectedDate).getDay();

  return (
    <VStack alignItems='stretch' my='8' minW='400px'>
      <HStack justifyContent='space-between' fontSize='2xl' mb='4' gap='8'>
        <Button onClick={handlePrevMonth} mr='4'>
          Prev
        </Button>
        <Text as='span' fontWeight='bold' textAlign='center'>
          {monthYearLabel}
        </Text>
        <Button onClick={handleNextMonth} ml='4'>
          Next
        </Button>
      </HStack>
      <Grid templateColumns='repeat(7, 1fr)' justifyItems='center'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <CalendarCell text={day} isHeader={true} key={day} isExpanded={isOn} />
        ))}
        <AnimatePresence>
          <LayoutGroup>
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <CalendarCell text={''} isHeader={false} key={'empty-' + index} isExpanded={isOn} />
            ))}
            {daysInMonth.map((day) => (
              <CalendarCell
                key={selectedDate.getMonth + '-' + day}
                onClick={() => {
                  setSelected(day);
                  const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                  setStartDate(date);
                }}
                text={day.toString()}
                isHeader={false}
                isExpanded={isOn}
                isSelected={selected === day}
              />
            ))}
          </LayoutGroup>
        </AnimatePresence>
      </Grid>
    </VStack>
  );
};

export default Calendar;
