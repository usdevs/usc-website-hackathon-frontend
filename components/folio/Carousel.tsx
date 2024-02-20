import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Box, Center, HStack, Stack, VStack } from '@chakra-ui/react'
import Image, { StaticImageData } from 'next/image'
import CarouselThumb from './CarouselThumb'

type CarouselProps = {
  images: StaticImageData[]
}

export default function Carousel({ images }: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: false })
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect)
    emblaMainApi.on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <Center>
      <Stack my='8'>
        <Box ref={emblaMainRef} w='xl' overflow='hidden'>
          <HStack maxW='100%'>
            {images.map((image, index) => (
              <div key={index} className='embla__slide' style={{ flex: '0 0 100%' }}>
                <Image src={image} alt={`folio-image-${index}`} />
              </div>
            ))}
          </HStack>
        </Box>

        <Box className='embla-thumbs' w='xl'>
          <Box overflow='hidden' ref={emblaThumbsRef}>
            <HStack>
              {images.map((image, index) => (
                <CarouselThumb
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                  image={image}
                  key={index}
                />
              ))}
            </HStack>
          </Box>
        </Box>
      </Stack>
    </Center>
  )
}
