import { Button, Grid, HStack, Text, VStack } from '@chakra-ui/react'
import { addMonths, format, isSameDay, startOfMonth, subMonths } from 'date-fns'
import { useState } from 'react'

import { BookingDataDisplay } from '@/types/bookings.types'
import { ToggleProps } from '@/types/utils.types'

import CalendarCell from '@/components/booking/CalendarCell'

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
  return <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{text}</div>
}

const Calendar: React.FC<CalendarProps> = ({ isOn, setStartDate, bookings }) => {
  //todo remove these duplicate states, use parent's state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selected, setSelected] = useState<number>(selectedDate.getDate())

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
      </Grid>
    </VStack>
  )
}

export default Calendar
