import * as React from 'react'
import { Component, useState } from 'react'
import { Box, HStack, VStack, Center, Text } from '@chakra-ui/react'
import { useBoolean, useDisclosure } from '@chakra-ui/react'
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval'
import format from 'date-fns/format'

import { BookingConfirmationPopup } from '../components/BookingConfirmationPopup'
import parse from 'date-fns/parse'

const BOX_HEIGHT = 8 // Ensures time labels are aligned with grid cells
const VENUES = ['CTPH', 'Chatterbox', "Maker's Studio", 'Amphi', 'TRR', 'TRB']

const TIME_INTERVALS = eachMinuteOfInterval(
  {
    start: new Date(2000, 1, 1, 0),
    end: new Date(2000, 1, 1, 23, 59),
  },
  { step: 30 },
).map((x) => format(x, 'HH:mm'))

// Individual Grid Cells for the time intervals
function VenueTimeCell({ onMouseDown, onMouseOver, selected }) {
  // Cell is coloured based on whether it's selected or not
  return (
    <Box
      w='40'
      h={BOX_HEIGHT}
      bg={selected ? 'blue.500' : 'gray.200'}
      _hover={{ bg: selected ? 'blue.700' : 'gray.300' }}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
    ></Box>
  )
}
// Column of Time Grid Cells for a single venue
function VenueBooking({ venueName, openBookingModal }) {
  const [mouseIsDown, setMouse] = useBoolean()

  // Venue column works by colouring in cells between firstSelected and lastSelected
  // firstSelected is updated when user holds the mouse down
  // lastSelected is updated when cursor moves over a cell while mouse is held down
  const [firstSelected, setFirst] = useState(-1)
  const [lastSelected, setLast] = useState(-1)

  return (
    <VStack spacing='0'>
      <Text fontSize='lg'>{venueName}</Text>
      <VStack
        onMouseDown={setMouse.on}
        onMouseUp={() => {
          setMouse.off()
          if (firstSelected === -1 || firstSelected > lastSelected) return

          const start = TIME_INTERVALS[firstSelected]
          const end = TIME_INTERVALS[(lastSelected + 1) % TIME_INTERVALS.length]
          openBookingModal({
            start: parse(start, 'HH:mm', new Date()),
            end: parse(end, 'HH:mm', new Date()),
          })
        }}
      >
        {TIME_INTERVALS.map((el, i) => (
          <VenueTimeCell
            key={el}
            onMouseDown={() => setFirst(i)}
            onMouseOver={() => {
              if (mouseIsDown) {
                firstSelected === -1 && setFirst(i)
                setLast(i)
              } else {
                setFirst(-1)
                setLast(-1)
              }
            }}
            selected={i >= firstSelected && i <= lastSelected}
          />
        ))}
      </VStack>
    </VStack>
  )
}

// Labels for time 0000-2330
function BookingTimes() {
  return (
    <VStack spacing='0'>
      <Text fontSize={'lg'}>Time</Text>
      <VStack>
        {TIME_INTERVALS.map((el, i) => (
          <Center h={BOX_HEIGHT} key={el}>
            {' '}
            {/* Ensures time labels are aligned with grid cells */}
            <Box>{el}</Box>
          </Center>
        ))}
      </VStack>
    </VStack>
  )
}

function BookingSelector() {
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bookingDataFromSelection, setBookingDataFromSelection] =
    useState<BookingDataFromSelection>({
      start: null,
      end: null,
      venueId: 1,
      venue: '',
    })
  const [unsuccessfulFormSubmitString, setUnsuccessfulFormSubmitString] = useState<string>('')
  const onModalClose = () => {
    setUnsuccessfulFormSubmitString('')
    onClose()
  }

  return (
    <HStack>
      <BookingConfirmationPopup
        isOpen={isOpen}
        onClose={onModalClose}
        startDate={startDate}
        setUnsuccessfulFormSubmitString={setUnsuccessfulFormSubmitString}
        unsuccessfulFormSubmitString={unsuccessfulFormSubmitString}
        bookingDataFromSelection={bookingDataFromSelection}
      />
      <BookingTimes />
      {VENUES.map((venueName, venueId) => (
        <VenueBooking
          key={venueName}
          venueName={venueName}
          openBookingModal={({ start, end }) => {
            setBookingDataFromSelection({
              ...bookingDataFromSelection,
              venue: venueName,
              venueId: venueId,
              start,
              end,
            })
            onOpen()
          }}
        />
      ))}
    </HStack>
  )
}

export default BookingSelector