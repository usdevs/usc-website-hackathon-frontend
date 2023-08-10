import { Button, Box, Icon } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'

interface CopyToClipboardButtonProps {
  textToCopy: string
}

const CopyTokenButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)

      // Reset the "Copied" state after a short delay (e.g., 2 seconds)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  return (
    <Button
      size='sm'
      variant='outline'
      _hover={{ transform: 'scale(1.2)' }}
      _active={{ transform: 'scale(0.9)' }}
      onClick={handleCopyToClipboard}
    >
      {copied ? (
        <Box display='flex' alignItems='center'>
          <Icon as={CheckCircleIcon} color='green.500' boxSize={4} mr={2} />
          Copied to clipboard
        </Box>
      ) : (
        'Copy to clipboard'
      )}
    </Button>
  )
}

export default CopyTokenButton
