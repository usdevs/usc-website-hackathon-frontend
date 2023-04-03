import { useState } from 'react'
import { Box, Button, Grid, HStack, Text, VStack } from '@chakra-ui/react'
import { format, startOfMonth, addMonths, subMonths, isSameDay } from 'date-fns'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

import { VENUES } from './CONSTANTS'

interface CellProps {
  text: string
  isExpanded: boolean
  isSelected: boolean
  onClick?: () => void
  bookings: Array<BookingDataDisplay>
}

interface CalendarProps extends ToggleProps {
  setStartDate: (date: Date) => void
  bookings: Array<BookingDataDisplay>
}

const spring = {
  type: 'spring',
  damping: 50,
  stiffness: 300,
}

type DayCellProps = Pick<CellProps, 'text' | 'isExpanded'>
const CalendarDayCell: React.FC<DayCellProps> = ({ text, isExpanded }) => {
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
  )
}

const CalendarCell: React.FC<CellProps> = ({ text, isExpanded, isSelected, onClick, bookings }) => {
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
      >
        {text}
        {isExpanded && (
          <motion.div initial='hidden' animate='visible' variants={list}>
            <VStack alignItems='flex-start' spacing='0' pl='4'>
              {bookings?.map((booking, i) => {
                return (
                  <motion.div variants={item} key={i}>
                    <Text
                      overflow='hidden'
                      h='2vh'
                      w='100%'
                      fontWeight='normal'
                      fontSize='sm'
                      textAlign='left'
                    >
                      {`${format(booking.from, 'h:mm')}-${format(booking.to, 'h:mm a')} ${
                        VENUES[booking.venueId]
                      }`}
                    </Text>
                  </motion.div>
                )
              })}
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
  )
}

const Calendar: React.FC<CalendarProps> = ({ isOn, setStartDate, bookings }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selected, setSelected] = useState(selectedDate.getDate())

  const handlePrevMonth = () => {
    setSelected(-1)
    setSelectedDate(subMonths(selectedDate, 1))
  }

  const handleNextMonth = () => {
    setSelected(-1)
    setSelectedDate(addMonths(selectedDate, 1))
  }

  const monthYearLabel = format(selectedDate, 'MMM yyyy')
  const daysInMonth = Array.from(
    { length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1,
  )
  const firstDayOfMonth = startOfMonth(selectedDate).getDay()

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
          <CalendarDayCell key={day} text={day} isExpanded={isOn} />
        ))}
        <AnimatePresence>
          <LayoutGroup>
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <CalendarCell
                text={''}
                bookings={[]}
                isSelected={false}
                key={'empty-' + index}
                isExpanded={isOn}
              />
            ))}
            {daysInMonth.map((day) => {
              const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
              const bookingsForDay = bookings.filter((booking) => {
                return isSameDay(booking.from, date)
              })

              return (
                <CalendarCell
                  key={selectedDate.getMonth + '-' + day}
                  onClick={() => {
                    setSelected(day)
                    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
                    setStartDate(date)
                  }}
                  text={day.toString()}
                  isExpanded={isOn}
                  isSelected={selected === day}
                  bookings={bookingsForDay}
                />
              )
            })}
          </LayoutGroup>
        </AnimatePresence>
      </Grid>
    </VStack>
  )
}

export default Calendar
