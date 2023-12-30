// app/page.tsx (comment)
// white words displayed to my user (line 30)
'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Text, Button, Heading, Image, Box, Input } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import {EmailIcon} from '@chakra-ui/icons'
import { Select, Container, Center, Square, IconButton } from '@chakra-ui/react' //can put in line 4 too
import { Stack, HStack, VStack, extendTheme, Textarea, StackDivider, GridItem, Grid} from '@chakra-ui/react'
import Footer from '../components/Footer';

export default function FolioSubmissionForm() {
  return (
    <ChakraProvider> 
    <VStack spacing = "25px">
    <Heading size='md' mt={4}>Create New Entry</Heading>

      <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          size = 'sm'
          width = '700px'
          bg = 'AliceBlue'
        >
          <Image
            objectFit='fill'
            maxW={{ base: '100%', sm: '550px' }}
            src='data:image/png;base64,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'
            alt='NUSC'
          />

          <Stack> 
            <CardBody>
              <Heading size='xs'>Module Code:</Heading>
              <Select placeholder='Select option' bg = 'white' size='xs'>
                <option value='option1'>NSW2001</option>
                <option value='option2'>NSW2002</option>
                <option value='option3'>NSW2003</option>
              </Select>

            </CardBody>

            <CardFooter>
              <Button variant='solid' colorScheme='blue' size='xs'>
                Confirm Module
              </Button>
            </CardFooter>
          </Stack>
        </Card>
        

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          size='sm'
          width = '700px'
          bg = 'AliceBlue'
        >
          <Image
            objectFit='fill'
            maxW={{ base: '100%', sm: '550px' }}
            src='data:image/png;base64,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'
            alt='NUSC'
          />

          <Stack> 
            <CardBody>
              <Heading size='xs'>Instructor:</Heading>
              <Select placeholder='Select option' bg = 'white' size='xs'>
                <option value='option1'>Dr Alberto Perez Pereiro</option>
                <option value='option2'>Dr Bjorn Gomez</option>
                <option value='option3'>Dr Chanad Somaiah</option>
                <option value='option4'>Dr Cheng Yi En</option>
                <option value='option5'>Dr Hanisah Sani</option>
                <option value='option6'>Dr Lee Chee Keng</option>
              </Select>
            </CardBody>

            <CardFooter>
              <Button variant='solid' colorScheme='blue' size='xs'>
                Select instructor
              </Button>
            </CardFooter>
          </Stack>
        </Card>
        

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          size='sm'
          width = '700px'
          bg = 'AliceBlue'
        >
          <Image
            objectFit='fill'
            maxW={{ base: '100%', sm: '550px' }}
            src='data:image/png;base64,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'
            alt='NUSC'
          />

          <Stack> 
            <CardBody>
              <Heading size='xs'>Annual Year:</Heading>
              <Select placeholder='Select option' bg = 'white' size='xs'>
                <option value='option1'>2018</option>
                <option value='option2'>2019</option>
                <option value='option3'>2020</option>
                <option value='option4'>2021</option>
                <option value='option5'>2022</option>
                <option value='option6'>2023</option>
              </Select>

            </CardBody>

            <CardFooter>
              <Button variant='solid' colorScheme='blue' size='xs'>
                Select instructor
              </Button>
            </CardFooter>
          </Stack>
        </Card>
        

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          size = 'sm'
          width = '700px'
          bg = 'AliceBlue'
        >
          <Image
            objectFit='fill'
            maxW={{ base: '100%', sm: '550px' }}
            src='data:image/png;base64,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'
            alt='NUSC'
          />

          <Stack> 
            <CardBody>
              <Heading size='xs'>Semester:</Heading>
              <Select placeholder='Select option' bg = 'white' size='xs'>
                <option value='option1'>Semester 1</option>
                <option value='option2'>Semester 2</option>
                <option value='option3'>Special Term</option>
              </Select>

            </CardBody>

            <CardFooter>
              <Button variant='solid' colorScheme='blue' size='xs'>
                Select Semester
              </Button>
            </CardFooter>
          </Stack>
        </Card>

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          size = 'sm'
          width = '700px'
          bg = 'AliceBlue'
        >

          <HStack spacing='40px'> 
            <CardBody>
              <Heading size='xs'>Student Name:</Heading> 

            </CardBody>

            <CardFooter>
            <Input placeholder='Type in name' size='sm' variant='outline' bg='white' width='300px' /> 
            </CardFooter>
          </HStack>
        </Card>

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          size = 'sm'
          width = '700px'
          bg = 'AliceBlue'
        >

          <HStack spacing='115px'> 
            <CardBody>
              <Heading size='xs'>Title:</Heading> 

            </CardBody>

            <CardFooter>
            <Input placeholder='Type in title' size='sm' variant='outline' bg='white' width = '300px' /> 
            </CardFooter>
          </HStack>
        </Card>

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          size = 'sm'
          width = '700px'
          bg = 'AliceBlue'
        >

          <HStack spacing='65px'> 
            <CardBody>
              <Heading size='xs'>Comments:</Heading> 

            </CardBody>

            <CardFooter>
            <Textarea placeholder='Type in comments' size='sm' variant='outline' bg='white' width = '300px' /> 
            </CardFooter>
          </HStack>
        </Card>

        <Card
         direction={{ base: 'column', sm: 'row' }}
         overflow='hidden'
         variant='outline'
         size = 'md'
         width = '900px'
         bg = '#1F407B'
         
       >    
     </Card>
      </VStack>
        <Footer/>
    </ChakraProvider> //closing tag - everything must go here
    
  )
}
