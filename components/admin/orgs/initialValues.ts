import { OrganisationForm } from '@/types/bookings.types'

const defaultValues: OrganisationForm = {
  id: -1,
  name: '',
  description: '',
  inviteLink: '',
  // photoUpload: null,
  isAdminOrg: false,
  isInvisible: false,
  isInactive: false,
  category: '',
  igHead: -1,
  otherMembers: [],
}

export default defaultValues
