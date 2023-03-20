import { useState } from 'react'
import { Box, Button, Grid, HStack, Text, VStack } from '@chakra-ui/react'
import { format, startOfMonth, addMonths, subMonths } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

const MONTH_TRANSITION_VARIANT = {
  hidden: { opacity: 0, x: '-100%' },
  visible: {
    opacity: 1,
    x: '0%',
    transition: {
      duration: 0.3,
      type: 'tween',
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: 0.3,
      type: 'tween',
    },
  },
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const monthYearLabel = format(currentMonth, 'MMMM yyyy')
  const daysInMonth = Array.from(
    { length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1,
  )
  const firstDayOfMonth = startOfMonth(currentMonth).getDay()

  return (
    <VStack w='800px' h='650px' alignItems='stretch' my='8'>
      <HStack justifyContent='center' fontSize='2xl' mb='4' gap='8'>
        <Button onClick={handlePrevMonth} mr='4'>
          Prev
        </Button>
        <Text as='span' fontWeight='bold' flexBasis='200px' textAlign='center'>
          {monthYearLabel}
        </Text>
        <Button onClick={handleNextMonth} ml='4'>
          Next
        </Button>
      </HStack>
      <Grid templateColumns='repeat(7, 1fr)'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box key={day} textAlign='center' fontWeight='bold'>
            {day}
          </Box>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <Box key={`empty-${index}`} height='100px' />
        ))}
        <AnimatePresence>
          {daysInMonth.map((day) => (
            <Box key={day} height='100px' textAlign='center'>
              <motion.div
                variants={MONTH_TRANSITION_VARIANT}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                {day}
              </motion.div>
            </Box>
          ))}
        </AnimatePresence>
      </Grid>
    </VStack>
  )
}

export default Calendar
