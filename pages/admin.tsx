import type { NextPage } from 'next'
import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import {
  getFromUrlArrayAndParseJson,
  getFromUrlStringAndParseJson,
  getFromUrlStringAndParseJsonWithAuth,
  isUserLoggedIn,
} from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'
import OrganisationControlForm from '../components/admin/orgs/OrganisationControlForm'
import UserControlForm from '../components/admin/users/UserControlForm'
import CopyTokenButton from '../components/admin/CopyTokenButton'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

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
    return <Box>Please log in first!</Box>
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

  if (errorOrgCategories || errorOrgs || errorUsers) {
    throw new Error("Could not fetch organisations' data from the backend")
  }

  const categoryTemp: any = allOrgCategories // parse due to typing issue in backend

  const categories = Object.keys(categoryTemp).map((category: any) => {
    return {
      value: category,
      description: category,
    }
  })

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
            categories={categories}
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
