import type { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import { Flex, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import Footer from '../components/Footer'
import IGCard from '../components/IGCard'
import IGMockDetails from '../constants/IGMockData'
import { useEffect, useState } from 'react'
import IGSearchFilter from '../components/IGSearchFilter'

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
}

export default StudentGroups
