export interface BaseFormProps {
  id: string
  name: string
  label: string
  form: {
    errors: { [key: string]: string | string[] }
    touched: { [key: string]: boolean }
  }
}

export type SelectProps<T> = {
  value: T
  label: string
}
