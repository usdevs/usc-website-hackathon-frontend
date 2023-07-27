import * as Yup from 'yup';
import defaultValues from './initialValues';

// Custom validation method for checking empty IG Head

function isNotDefaultNumber(value: number | undefined) {
  return value !== defaultValues.igHead;
}

Yup.addMethod(Yup.number, 'requireValidNumber', function(message: string) {
  return this.test('requireValidNumber', message, isNotDefaultNumber)
});

declare module 'yup' {
  interface NumberSchema {
    requireValidNumber(message: string): NumberSchema<number>;
  }
}

const validationSchema = Yup.object().shape({
  id: Yup.number(),
  name: Yup.string().required('Name cannot be empty'),
  igHead: Yup.number().requireValidNumber('Head cannot be empty').required(),
  description: Yup.string().required('Description cannot be empty'),
  inviteLink: Yup.string().required('Invite link cannot be empty'),
  isAdminOrg: Yup.bool().required(),
  isInvisible: Yup.bool().required(),
  isInactive: Yup.bool().required(),
  category: Yup.string().required('Category cannot be empty'),
  otherMembers: Yup.array()
});

export default validationSchema;
