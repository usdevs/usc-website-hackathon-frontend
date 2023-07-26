import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    id: Yup.number(),
    name: Yup.string().required('Name is required'),
    telegramUserName: Yup.string().required('Telegram username is required')
})

export default validationSchema
