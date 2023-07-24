import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    igHead: Yup.number().required('Head is required'),
    description: Yup.string().required('Description is required'),
    inviteLink: Yup.string().required('Invite Link is required'),
    isAdminOrg: Yup.bool().required(),
    isInvisible: Yup.bool().required(),
    isInactive: Yup.bool().required(),
    category: Yup.string().required(),
  })

  export default validationSchema