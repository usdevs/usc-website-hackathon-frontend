import { Box, Center, Grid, GridItem, HStack, Heading, Stack } from '@chakra-ui/react'
import useEmblaCarousel from 'embla-carousel-react'
import Image, { StaticImageData } from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import CarouselThumb from './CarouselThumb'

type CarouselProps = {
  images: StaticImageData[]
  title: string
}

export default function Carousel({ images, title }: CarouselProps) {
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
    <Center overflowX='auto' py='8'>
      <Grid gridTemplateColumns={{ base: 'repeat(1, 1fr)', lg: 'auto auto' }}>
        <GridItem h='100%'>
          <Box bg='brand.primary' color='white' h='100%' maxW={{ base: '100%', lg: '30vw' }}>
            <Heading as='h2' size='3xl' py='12' px='8'>
              {title}
            </Heading>
          </Box>
        </GridItem>
        <GridItem>
          <Stack w={{ base: '100vw', md: 'xl', lg: '2xl' }}>
            <Box ref={emblaMainRef} overflow='hidden'>
              <HStack maxW='100%'>
                {images.map((image, index) => (
                  <div key={index} style={{ flex: '0 0 100%' }}>
                    <Image src={image} alt={`stylio-image-${index}`} />
                  </div>
                ))}
              </HStack>
            </Box>

            <Box className='embla-thumbs'>
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
        </GridItem>
      </Grid>
    </Center>
  )
}
