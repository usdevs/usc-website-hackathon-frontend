import type { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import {
  Box,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  StackDivider,
  Stack,
  VStack
} from '@chakra-ui/react'
import Footer from '../components/Footer'
import IGCard from '../components/IGCard'
import IGMockDetails from '../constants/IGMockData'
import { useEffect, useState } from 'react'

const InterestGroups: NextPage = () => {
  const interestGroupDetails : IGInfo[] = IGMockDetails
  const interestGroupCategories = ['Arts', 'Sports', 'GUI', 'Inactive']
  const originalFilters : string[] = []

  const [interestGroupCards, setInterestGroupCards] = useState(interestGroupDetails);
  const [originalInterestGroupCards] = useState(interestGroupDetails);
  const [interestGroupFilters, setInterestGroupFilters] = useState(originalFilters)
  const [interestGroupSearchString, setInterestGroupSearchString] = useState('')

  const onInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target
    setInterestGroupSearchString(value.toLowerCase())
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = ev.target;
    if (checked) {
      setInterestGroupFilters([...interestGroupFilters, value]);
    } else {
      setInterestGroupFilters(interestGroupFilters.filter(filter => filter !== value));
    }
  };

  useEffect(() => {
    let filteredCards = originalInterestGroupCards;
    if (interestGroupFilters.length > 0) {
      filteredCards = filteredCards.filter(card => interestGroupFilters.includes(card.category))
    }
    filteredCards = filteredCards.filter(ig => ig.title.toLowerCase().includes(interestGroupSearchString));
    setInterestGroupCards(filteredCards);
  }, [interestGroupFilters, interestGroupSearchString])

  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <HStack pt='3rem' pb='3rem'>
        {
          // align='stretch' // spacing={30}
          //todo align to top
        }
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          maxWidth='100rem'
          width='100rem'
          margin='0 1rem'
          alignSelf='flex-start'
          boxShadow='1px 1px #e9e9e9'
          color='#a1a1a1'

          // align='flex-start'
          // alignItems="flex-start"
        >
          <CardBody>
            <InputGroup>
              <Input 
                type='text'
                border='none' 
                placeholder='Search for groups'
                onInput={onInput}
              />
            </InputGroup>
            <CheckboxGroup colorScheme='green' defaultValue={['arts', 'sports', 'gui']}>
              <Stack mt='0.5rem' direction={['column', 'column']}>
                {interestGroupCategories.map(category=><Checkbox onChange={onChange}value={category}>{category}</Checkbox>)}
              </Stack>
            </CheckboxGroup>
          </CardBody>
        </Card>
        <VStack flexGrow={1} pr='4rem'>
          <Heading as='h3' size='lg' fontWeight='normal' alignSelf='flex-start'>
            {
              interestGroupCards.length > 0
              ? <><strong>{interestGroupCards.length}</strong> Interest Groups </>
              : <>No Interest Groups Found</>
            }
            
          </Heading>
          <SimpleGrid columns={[1, null, 2]} spacing='40px'>
            {interestGroupCards.map((interestGroupDetail, idx) => (
              <IGCard key={idx} ig_info={interestGroupDetail} />
            ))}
          </SimpleGrid>
        </VStack>
      </HStack>
      <Footer />
    </Flex>
  )
}

export default InterestGroups
