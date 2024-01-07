'use client'
import { ChakraProvider } from '@chakra-ui/react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Button,
  Heading,
  Image,
  Box,
  Input,
} from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import Footer from '../../components/Footer'
import SelectCard from '../../components/folioform/SelectCard'
import ShortAnswerCard from '../../components/folioform/ShortAnswerCard'
import LongAnswerCard from '../../components/folioform/LongAnswerCard'

export default function FolioSubmissionForm() {
  return (
    <ChakraProvider>
      <VStack spacing='25px' mb={8}>
        <Heading size='md' mt={4}>
          Create New Entry
        </Heading>
        <SelectCard
          label='Module Code'
          optionName='Module'
          options={['NSW2001', 'NSW2002', 'NSW2003']}
        />{' '}
        {/*TODO: Pull from Backend here*/}
        <SelectCard
          label='Instructor'
          optionName='Instructor'
          options={[
            'Dr Alberto Perez Pereiro',
            'Dr Bjorn Gomez',
            'Dr Chanad Somaiah',
            'Dr Cheng Yi En',
            'Dr Hanisah Sani',
            'Dr Lee Chee Keng',
          ]}
        />{' '}
        {/*TODO: Pull from Backend here*/}
        <SelectCard
          label='Academic Year'
          optionName='Academic Year'
          options={['2018', '2019', '2020', '2021', '2022', '2023']}
        />{' '}
        {/*TODO: Pull from Backend here*/}
        <SelectCard
          label='Semester'
          optionName='Semester'
          options={['Semester 1', 'Semester 2', 'Special Term 1', 'Special Term 2']}
        />{' '}
        {/*TODO: Pull from Backend here*/}
        <ShortAnswerCard label='Student Name' prompt="Enter Student's name" />
        <ShortAnswerCard label='Title' prompt='Enter ' />
        <LongAnswerCard label='Content' prompt='Enter Content' />
        <Button colorScheme='blue' size='lg' mt={4} onClick={() => console.log('Submitted')}>
          Submit
        </Button>
      </VStack>
      <Footer />
    </ChakraProvider>
  )
}
