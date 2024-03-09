import type { NextPage } from 'next'
import { Button, Flex, Grid, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
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

  const pageNumberButtons = (
    <SimpleGrid minChildWidth='20px' w='100%' my='4'>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <Button
          size='lg'
          key={pageNumber}
          onClick={() => setPage(pageNumber)}
          variant={page === pageNumber ? 'solid' : 'ghost'}
          colorScheme='blue'
          style={{ borderRadius: '15px' }}
        >
          {pageNumber}
        </Button>
      ))}
    </SimpleGrid>
  )

  return (
    <>
      <Flex justify='center' flexDir='column' as='main'>
        <VStack flexGrow={1} minH='40vh'>
          <IGSearchFilter {...igSearchFilterProps} />
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='2rem'>
            {paginateArray(page).map((interestGroupDetail, idx) => (
              <IGCard
                key={interestGroupDetail.name}
                imageKey={idx * 2}
                ig_info={interestGroupDetail}
              />
            ))}
          </SimpleGrid>
          {pageNumberButtons}
        </VStack>
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
