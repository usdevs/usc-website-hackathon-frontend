import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import type { NextPage } from 'next'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

import {
  getFromUrlArrayAndParseJson,
  getFromUrlStringAndParseJson,
  getFromUrlStringAndParseJsonWithAuth,
  isUserLoggedIn,
} from '@/utils/booking'
import { makeCategoriesPrettier } from '@/utils/orgUtils'

import { OrganisationWithIGHead, User } from '@/types/bookings.types'

import { useUserInfo } from '@/hooks/useUserInfo'

import CopyTokenButton from '@/components/admin/CopyTokenButton'
import OrganisationControlForm from '@/components/admin/orgs/OrganisationControlForm'
import UserControlForm from '@/components/admin/users/UserControlForm'

const AdminPage: NextPage = () => {
  const [authOrNull] = useUserInfo()
  const {
    data: users,
    error: errorUsers,
    isLoading: isLoadingUsers,
    mutate: mutateUsers,
  } = useSWR<User[], string[]>(
    authOrNull?.token ? [process.env.NEXT_PUBLIC_BACKEND_URL + 'users', authOrNull.token] : null,
    getFromUrlStringAndParseJsonWithAuth,
  )
  const {
    data: orgs,
    error: errorOrgs,
    isLoading: isLoadingOrgs,
    mutate: mutateOrgs,
  } = useSWR<OrganisationWithIGHead[], string[]>(
    [process.env.NEXT_PUBLIC_BACKEND_URL, 'orgs'],
    getFromUrlArrayAndParseJson,
  )
  const {
    data: allOrgCategories,
    error: errorOrgCategories,
    isLoading: isLoadingOrgCategories,
  } = useSWRImmutable<{ [key: string]: string }, string>(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'orgs/categories',
    getFromUrlStringAndParseJson,
  )

  if (!isUserLoggedIn(authOrNull) || authOrNull === null) {
    return (
      <Box>
        Please log in first! Also, note that an admin user is one who is a part of a NUSC admin
        organisation. Student group heads may not necessarily be admin users.
      </Box>
    )
  }

  if (
    isLoadingOrgCategories ||
    isLoadingOrgs ||
    isLoadingUsers ||
    !orgs ||
    !allOrgCategories ||
    !users
  ) {
    return <Box>Fetching data! Spinner</Box>
  }

  // TODO: update this error as it will never trigger; if errorUsers, then users will be undefined
  if (errorOrgCategories || errorOrgs || errorUsers) {
    throw new Error("Could not fetch organisations' data from the backend")
  }

  return (
    <Tabs align='center' size='lg'>
      <TabList>
        <Tab flexGrow={1}>Organisations</Tab>
        <Tab flexGrow={1}>Users</Tab>
        <Tab flexGrow={1}>Token</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <OrganisationControlForm
            orgs={orgs}
            categories={makeCategoriesPrettier(allOrgCategories)}
            users={users}
            mutateOrgs={mutateOrgs}
            mutateUsers={mutateUsers}
          />
        </TabPanel>
        <TabPanel>
          <UserControlForm users={users} mutateOrgs={mutateOrgs} mutateUsers={mutateUsers} />
        </TabPanel>
        <TabPanel>
          <CopyTokenButton textToCopy={authOrNull.token} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default AdminPage
