import type { NextPage } from 'next'
import React from 'react'
import NavMenu from '../components/NavMenu'
import {
  Box,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  StackDivider,
  Stack,
} from '@chakra-ui/react'
import Footer from '../components/Footer'
import IGCard from '../components/IGCard'
import { SearchIcon } from '@chakra-ui/icons'

const IGDetails: IGInfo[] = [
  {
    contact: 'Many Zhi Sheng Zhi Sheng Zhi Sheng Zhi Sheng',
    invite_link: 'https://www.google.com',
    image: '/icon.png',
    title: 'Asian Undergraduate Summit',
    description:
      'The Asian Undergraduate Summit (AUS) is a student-led, student-run international conference by' +
      ' the National University of Singapore (NUS) University Scholars Programme (USP). The Summit aims to bring together undergraduates of diverse disciplines from Asia and provide them with the opportunity to engage in meaningful academic, cultural, and social exchange.',
    category: 'GUI',
  },
  {
    contact: 'Zhi Sheng',
    invite_link: 'https://www.google.com',
    image: '/icon.png',
    title: 'Asian Undergraduate Summit',
    description:
      'The Asian Undergraduate Summit (AUS) is a student-led, student-run international conference by' +
      ' the National University of Singapore (NUS) University Scholars Programme (USP). The Summit aims to bring together undergraduates of diverse disciplines from Asia and provide them with the opportunity to engage in meaningful academic, cultural, and social exchange.',
    category: 'GUI',
  },
  {
    contact: 'Zhi Sheng',
    invite_link: 'https://www.google.com',
    image: '/icon.png',
    title: 'Asian Undergraduate Summit',
    description:
      'The Asian Undergraduate Summit (AUS) is a student-led, student-run international conference by' +
      ' the National University of Singapore (NUS) University Scholars Programme (USP). The Summit aims to bring together undergraduates of diverse disciplines from Asia and provide them with the opportunity to engage in meaningful academic, cultural, and social exchange.',
    category: 'GUI',
  },
]

const InterestGroups: NextPage = () => {
  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <HStack divider={<StackDivider borderColor='gray.200' />}>
        // align='stretch' // spacing={30}
        //todo align to top
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          width={'20vw'}
          // align='flex-start'
          // alignItems="flex-start"
        >
          <CardBody>
            <InputGroup>
              <InputLeftElement pointerEvents='none' children={<SearchIcon color='gray.300' />} />
              <Input type='text' placeholder='Search for groups' />
            </InputGroup>
            <CheckboxGroup colorScheme='green' defaultValue={['arts', 'sports', 'gui']}>
              <Stack spacing={[1, 5]} direction={['column', 'column']}>
                <Checkbox value='arts'>Arts</Checkbox>
                <Checkbox value='sports'>Sports</Checkbox>
                <Checkbox value='gui'>GUI</Checkbox>
                <Checkbox value='inactive'>Inactive</Checkbox>
              </Stack>
            </CheckboxGroup>
          </CardBody>
        </Card>
        //todo fix margin and padding for the IG cards
        <Box pt={'1vh'}>
          <SimpleGrid columns={[1, null, 2]} maxWidth={'1000px'} spacing='40px'>
            {IGDetails.map((IGDetail) => (
              <IGCard key={IGDetail.title} ig_info={IGDetail} />
            ))}
          </SimpleGrid>
        </Box>
      </HStack>
      <Footer />
    </Flex>
  )
}

export default InterestGroups
