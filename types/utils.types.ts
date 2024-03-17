export interface NavigationLink {
  href: string
  label: string
}

export interface ToggleProps {
  isOn: boolean
  setIsOn: (isOn: boolean) => void
}
