import { Card, CardBody, Divider, Heading, Link, List, ListItem } from '@chakra-ui/react'
import { useState } from 'react'

const Links = ({
  items,
  onSelect,
  selectedItem,
}: {
  items: string[]
  onSelect: (item: string) => void
  selectedItem: string | null
}) => {
  return (
    <Card
      maxH='200px'
      overflowY='auto'
      variant='unstyled'
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'gray.200',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'blue.500',
          borderRadius: '24px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'blue.600',
        },
      }}
    >
      <List styleType='none'>
        {items.map((item, index) => (
          <ListItem key={index} padding={2} width='container'>
            <Link
              fontWeight={selectedItem === item ? 'bold' : 'normal'}
              color='blue.500'
              href='#'
              onClick={(e) => {
                e.preventDefault()
                onSelect(item)
              }}
            >
              {item}
            </Link>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

const ScrollableList = ({ title, items }: { title: string; items: string[] }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleSelection = (item: string) => {
    setSelectedItem(item)
  }

  return (
    <Card width='max-content' align='center'>
      <CardBody>
        <Heading size='sm'>{title}</Heading>
        <Divider margin='9px' />
        <Links items={items} onSelect={handleSelection} selectedItem={selectedItem} />
      </CardBody>
    </Card>
  )
}

export default ScrollableList
