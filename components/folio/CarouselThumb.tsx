import { Box } from '@chakra-ui/react'
import Image, { StaticImageData } from 'next/image'
import React from 'react'

type PropType = {
  selected: boolean
  image: StaticImageData
  index: number
  onClick: () => void
}

export default function CarouselThumb(props: PropType) {
  const { selected, image, index, onClick } = props

  return (
    <Box flex={'0 0 25%'} opacity={selected ? 1 : 0.5}>
      <button onClick={onClick} className='embla-thumbs__slide__button' type='button'>
        <div className='embla-thumbs__slide__number'>
          <span>{index + 1}</span>
        </div>
        <Image src={image} alt={`folio-image-${index}`} className='embla-thumbs__slide__img' />
      </button>
    </Box>
  )
}
