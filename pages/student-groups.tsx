import type { NextPage } from 'next'
import NavMenu from '../components/NavMenu'
import { Box, Flex, Heading, HStack, SimpleGrid, VStack, Button } from '@chakra-ui/react'
import Footer from '../components/Footer'
import IGCard from '../components/IGCard'
import { ChangeEvent, useEffect, useState } from 'react'
import IGSearchFilter from '../components/IGSearchFilter'

const StudentGroups: NextPage = () => {
  const interestGroupCategories = ['Socio-cultural', 'Sports', 'GUIPs', 'Inactive']
  const originalFilters: string[] = []

  const [interestGroupCards, setInterestGroupCards] = useState<OrganisationWithIGHead[]>([])
  const [originalInterestGroupCards, setOriginalInterestGroupCards] = useState<
    OrganisationWithIGHead[]
  >([])
  const [interestGroupFilters, setInterestGroupFilters] = useState(originalFilters)
  const [interestGroupSearchString, setInterestGroupSearchString] = useState('')

  const onInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target
    setInterestGroupSearchString(value.toLowerCase())
  }

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = ev.target
    if (checked) {
      setInterestGroupFilters([...interestGroupFilters, value])
    } else {
      setInterestGroupFilters(interestGroupFilters.filter((filter) => filter !== value))
    }
  }

  useEffect(() => {
    ;(async () => {
      const allOrgs = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs')
      const allBookings = await allOrgs.json()
      setInterestGroupCards(allBookings)
      setOriginalInterestGroupCards(allBookings)
    })()
    return () => {}
  }, [])

  useEffect(() => {
    let filteredCards = originalInterestGroupCards
    if (interestGroupFilters.length > 0) {
      filteredCards = filteredCards.filter((card) => interestGroupFilters.includes(card.category))
    }
    filteredCards = filteredCards.filter((ig) =>
      ig.name.toLowerCase().includes(interestGroupSearchString),
    )
    setInterestGroupCards(filteredCards)
    setPage(1)
  }, [interestGroupFilters, interestGroupSearchString, originalInterestGroupCards])

  const igSearchFilterProps = {
    onInput: onInput,
    onChange: onChange,
    interestGroupCategories: interestGroupCategories,
  }

  const pageSize = 10
  const [page, setPage] = useState(1)
  const paginateArray = (pageNumber: any) => {
      return interestGroupCards.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize)
  }
  const totalPages = Math.ceil(interestGroupCards.length / pageSize)

  return (
    <Flex justify='center' flexDir='column' as='main'>
      <NavMenu />
      <HStack pt='3rem' pb='3rem'>
        <Box alignSelf='flex-start' p={'2vh'} pl={'7vh'}>
          <IGSearchFilter {...igSearchFilterProps} />
        </Box>
        <VStack flexGrow={1} pr='4rem' minH='45vh'>
          <Heading
            fontFamily={'header'}
            size='lg'
            fontWeight='normal'
            alignSelf='flex-start'
            mb='1.5rem'
          >
            {interestGroupCards.length > 0 ? (
              <>
                <strong>{interestGroupCards.length}</strong> Interest Group
                {interestGroupCards.length > 1 && 's'}
              </>
            ) : (
              <>No Interest Groups Found</>
            )}
          </Heading>
          <SimpleGrid columns={[1, null, 2]} width={'95%'} spacing='2rem'>
            {paginateArray(page).map((interestGroupDetail, idx) => (
              <IGCard key={interestGroupDetail.name} imageKey={idx * 2} ig_info={interestGroupDetail} />
            ))}
          </SimpleGrid>
          <HStack style={{ width: "80%", justifyContent: "center", marginTop: "3rem"}}>
            { Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(pageNumber => 
                    <Button style={{height: 60, width: 60}} key={pageNumber} onClick={() => setPage(pageNumber)}>{pageNumber}</Button>
                )
            }
        </HStack>
        </VStack>
      </HStack>
      <Footer />
    </Flex>
  )
}

export default StudentGroups
