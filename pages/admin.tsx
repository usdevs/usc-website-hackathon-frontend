import type { NextPage } from 'next'
import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { isUserLoggedIn } from '../utils'
import { useUserInfo } from '../hooks/useUserInfo'
import OrganisationControlForm from '../components/admin/orgs/OrganisationControlForm'
import UserControlForm from '../components/admin/users/UserControlForm'
import CopyTokenButton from '../components/admin/CopyTokenButton'

const AdminPage: NextPage = () => {
  const [auth] = useUserInfo()
  if (!isUserLoggedIn(auth) || auth === null) {
    return <Box>Please log in first!</Box>
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
          <OrganisationControlForm />
        </TabPanel>
        <TabPanel>
          <UserControlForm />
        </TabPanel>
        <TabPanel>
          <CopyTokenButton textToCopy={auth.token} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default AdminPage
