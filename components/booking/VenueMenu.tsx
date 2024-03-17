import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react'

import { ALL_VENUES_KEYWORD, getVenueFromId } from '@/utils/booking'

import { Venue } from '@/types/bookings.types'

type Props = {
  venueIdToFilterBy: number
  setVenueIdToFilterBy: (id: number) => void
  venues: Venue[]
}

export default function VenueMenu({ venueIdToFilterBy, setVenueIdToFilterBy, venues }: Props) {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} colorScheme='blue' rightIcon={<ChevronDownIcon />} w='200px'>
        {venueIdToFilterBy === 0 ? 'Venue' : getVenueFromId(venues, venueIdToFilterBy).name}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={ALL_VENUES_KEYWORD.name} type='radio'>
          {[ALL_VENUES_KEYWORD, ...venues].map((venue) => (
            <MenuItemOption
              onClick={() => setVenueIdToFilterBy(venue.id)}
              key={venue.id}
              value={venue.name}
            >
              {venue.name}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
