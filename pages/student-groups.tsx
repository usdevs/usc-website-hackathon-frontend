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
  Spacer,
  Grid,
  GridItem,
  Heading,
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

const StudentGroups: NextPage = () => {
  return (
    <>
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
    </>
  )
}

export default StudentGroups
