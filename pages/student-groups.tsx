import type { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import { Flex, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import {
  Box,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Input,
  InputGroup,
  InputLeftElement,
  StackDivider,
  Stack,
  Spacer,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import Footer from '../components/Footer'
import IGCard from '../components/IGCard'
import IGMockDetails from '../constants/IGMockData'
import { useEffect, useState } from 'react'
import IGSearchFilter from '../components/IGSearchFilter'
import { SearchIcon } from '@chakra-ui/icons'

const StudentGroups: NextPage = () => {
  /* make requests to backend here */
  const interestGroupDetails: IGInfo[] = IGMockDetails
  const interestGroupCategories = ['Socio-cultural', 'Sports', 'GUIPs', 'Inactive']
  const originalFilters: string[] = []

  const [interestGroupCards, setInterestGroupCards] = useState(interestGroupDetails)
  const [originalInterestGroupCards] = useState(interestGroupDetails)
  const [interestGroupFilters, setInterestGroupFilters] = useState(originalFilters)
  const [interestGroupSearchString, setInterestGroupSearchString] = useState('')

  const onInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target
    setInterestGroupSearchString(value.toLowerCase())
  }

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = ev.target
    if (checked) {
      setInterestGroupFilters([...interestGroupFilters, value])
    } else {
      setInterestGroupFilters(interestGroupFilters.filter((filter) => filter !== value))
    }
  }

  useEffect(() => {
    let filteredCards = originalInterestGroupCards
    if (interestGroupFilters.length > 0) {
      filteredCards = filteredCards.filter((card) => interestGroupFilters.includes(card.category))
    }
    filteredCards = filteredCards.filter((ig) =>
      ig.title.toLowerCase().includes(interestGroupSearchString),
    )
    setInterestGroupCards(filteredCards)
  }, [interestGroupFilters, interestGroupSearchString, originalInterestGroupCards])

  const igSearchFilterProps = {
    onInput: onInput,
    onChange: onChange,
    interestGroupCategories: interestGroupCategories,
  }

  return (
    // TODO M removed Flex here
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <Grid templateColumns='repeat(4, 1fr)' gap={8}>
        <GridItem colSpan={1}>
          <Box p={'2vh'} pl={'7vh'}>
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
              shadow='lg'
            >
              <CardBody>
                <InputGroup>
                  <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' />
                  </InputLeftElement>
                  <Input type='text' placeholder='Search for groups' />
                </InputGroup>
                <Box p={'2vh'}>
                  <CheckboxGroup colorScheme='green' defaultValue={['arts', 'sports', 'gui']}>
                    <Stack spacing={[1, 5]} direction={['column', 'column']}>
                      <Checkbox value='arts'>Socio-cultural</Checkbox>
                      <Checkbox value='sports'>Sports</Checkbox>
                      <Checkbox value='gui'>GUIPs</Checkbox>
                      <Checkbox value='inactive'>Inactive</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </GridItem>

        <GridItem colSpan={3}>
          <Box pt={'2vh'}>
            <Heading color={'gray.600'} fontSize={'2xl'} fontFamily={'header'}>
              {IGDetails.length} Interest Groups
            </Heading>
          </Box>

          <Box pt={'2vh'} pb={'3vh'}>
            <SimpleGrid columns={[1, null, 2]} maxWidth={'95%'} spacing='40px'>
              {IGDetails.map((IGDetail) => (
                <IGCard key={IGDetail.title} ig_info={IGDetail} />
              ))}
            </SimpleGrid>
          </Box>
        </GridItem>
      </Grid>
      <Footer />
    </Flex>
  )
}

export default StudentGroups

/*
  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <HStack pt='3rem' pb='3rem'>
        <IGSearchFilter {...igSearchFilterProps} />
        <VStack flexGrow={1} pr='4rem' minH='45vh'>
          <Heading as='h3' size='lg' fontWeight='normal' alignSelf='flex-start' mb='1.5rem'>
            {interestGroupCards.length > 0 ? (
              <>
                <strong>{interestGroupCards.length}</strong> Interest Groups{' '}
              </>
            ) : (
              <>No Interest Groups Found</>
            )}
          </Heading>
          <SimpleGrid columns={[1, null, 2]} spacing='2rem' overflowY='auto'>
            {interestGroupCards.map((interestGroupDetail, idx) => (
              <IGCard key={idx} ig_info={interestGroupDetail} />
            ))}
          </SimpleGrid>
        </VStack>
      </HStack>
      <Footer />
    </Flex>
  )
 */
