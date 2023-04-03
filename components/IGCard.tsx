import {
  Box,
  Button,
  Card,
  Center,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { ExpandableText } from './ExpandableText'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'

interface IGInfoProps {
  ig_info: IGInfo
}

const LeftPane: React.FC<IGInfoProps> = (props) => {
  return (
    <Box>
      <Center>
        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '100px' }}
          src={props.ig_info.image}
          alt='IG Picture'
        />
      </Center>
      <CardFooter>
        <VStack>
          <Button
            overflow='hidden'
            textOverflow={'ellipsis'}
            leftIcon={<FaUserCircle />}
            variant='outline'
            colorScheme='blue'
            minWidth={'8vw'}
            maxWidth={'8vw'}
          >
            <Text noOfLines={[1]}>{props.ig_info.contact}</Text>
          </Button>
          <Link href={props.ig_info.invite_link} rel='noopener noreferrer' target='_blank'>
            <Button variant='outline' colorScheme='blue' minWidth={'8vw'} maxWidth={'8vw'}>
              Invite Link
            </Button>
          </Link>
        </VStack>
      </CardFooter>
    </Box>
  )
}

const IGCard: React.FC<IGInfoProps> = (props) => {
  return (
    <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline'>
      <LeftPane ig_info={props.ig_info} />
      <Stack>
        <CardBody>
          <Heading
            // color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}
          >
            {props.ig_info.title}
          </Heading>

          <ExpandableText noOfLines={3}>
            <Text color={'gray.500'}>{props.ig_info.description}</Text>
          </ExpandableText>
        </CardBody>
      </Stack>
    </Card>
  )
}

export default IGCard
