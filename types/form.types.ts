export interface BaseFromProps {
  id: string
  name: string
  label: string
  form: {
    errors: { [key: string]: string | string[] }
    touched: { [key: string]: boolean }
  }
}
