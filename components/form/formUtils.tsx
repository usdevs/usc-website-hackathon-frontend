import { FieldProps, getIn } from 'formik'

/**
 * Determines whether the form component should re-render.
 *
 * @param prevProps Previous props of the form component
 * @param nextProps Next props of the form component
 * @return true if the form component should not re-render; false otherwise
 */
export const propsAreEqual = (prevProps: FieldProps, nextProps: FieldProps) => {
  const { name, value: prevValue } = prevProps.field
  const { errors: prevErrors, isSubmitting: prevIsSubmitting } = prevProps.form
  const { value: nextValue } = nextProps.field
  const { errors: nextErrors, isSubmitting: nextIsSubmitting } = nextProps.form
  const valueIsUnchanged = prevValue === nextValue
  const errorIsUnchanged = getIn(prevErrors, name) === getIn(nextErrors, name)
  const isSubmittingIsUnchanged = prevIsSubmitting === nextIsSubmitting
  return valueIsUnchanged && errorIsUnchanged && isSubmittingIsUnchanged
}
