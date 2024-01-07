import { Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import Link from 'next/link'

const CreateButton = ({ href }: { href: string }) => {
  return (
    <Link href={href}>
      <Button leftIcon={<AddIcon />} colorScheme='blue'>
        Create
      </Button>
    </Link>
  )
}

export default CreateButton
