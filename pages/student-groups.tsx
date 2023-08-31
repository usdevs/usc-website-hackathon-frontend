import type { NextPage } from 'next'
import { Button, Flex, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import Footer from '../components/Footer'
import IGCard from '../components/IGCard'
import { ChangeEvent, useEffect, useState } from 'react'
import IGSearchFilter from '../components/IGSearchFilter'
import { makeCategoriesPrettier } from '../utils/orgUtils'

export const DEFAULT_FILTERS: string[] = ['Sports', 'SocioCultural', 'Others']

const StudentGroups: NextPage<{
  allOrgs: OrganisationWithIGHead[]
  allIGCategories: { [key: string]: string }
}> = ({ allOrgs, allIGCategories }) => {
  const [igCardsToDisplay, setIgCardsToDisplay] = useState<OrganisationWithIGHead[]>(allOrgs)
  const [interestGroupFilters, setInterestGroupFilters] = useState(DEFAULT_FILTERS)
  const [interestGroupSearchString, setInterestGroupSearchString] = useState('')
  const [isInactive, setIsInactive] = useState<boolean>(false)

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
    let visibleCards = allOrgs.filter((card) => !card.isInvisible)
    let inactiveFilteredCards = visibleCards.filter((card) => !(card.isInactive && !isInactive))
    let filteredCards = inactiveFilteredCards.filter((card) =>
      interestGroupFilters.includes(card.category),
    )
    filteredCards = filteredCards.filter((ig) =>
      ig.name.toLowerCase().includes(interestGroupSearchString),
    )
    setIgCardsToDisplay(filteredCards)
    setPage(1)
  }, [interestGroupFilters, interestGroupSearchString, allOrgs, isInactive])

  const igSearchFilterProps = {
    onInput: onInput,
    onChange: onChange,
    onInactiveChange: (ev: ChangeEvent<HTMLInputElement>) =>
      ev.target.checked ? setIsInactive(true) : setIsInactive(false),
    interestGroupCategories: allIGCategories,
  }

  const pageSize = 10
  const [page, setPage] = useState(1)
  const paginateArray = (pageNumber: number) => {
    return igCardsToDisplay.slice(
      (pageNumber - 1) * pageSize,
      (pageNumber - 1) * pageSize + pageSize,
    )
  }
  const totalPages = Math.ceil(igCardsToDisplay.length / pageSize)

  return (
    <>
      <Flex justify='center' flexDir='column' as='main'>
        <VStack flexGrow={1} minH='40vh' p={4}>
          <IGSearchFilter {...igSearchFilterProps} />
          <SimpleGrid columns={[1, 1, 2]} width={'95%'} spacing='2rem'>
            {paginateArray(page).map((interestGroupDetail, idx) => (
              <IGCard
                key={interestGroupDetail.name}
                imageKey={idx * 2}
                ig_info={interestGroupDetail}
              />
            ))}
          </SimpleGrid>
          <HStack style={{ width: '80%', justifyContent: 'center', marginTop: '3rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                style={{ height: 60, width: 60 }}
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
          </HStack>
        </VStack>
        <Footer />
      </Flex>
    </>
  )
}

export async function getStaticProps() {
  const [orgs, igCategories] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs'),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs/categories'),
  ])
  const allOrgs = await (await orgs).json()
  const allIGCategories: { [key: string]: string } = makeCategoriesPrettier(
    await (await igCategories).json(),
  )
  return { props: { allOrgs, allIGCategories }, revalidate: 86400 } // regenerate every 1 day
}

export default StudentGroups
