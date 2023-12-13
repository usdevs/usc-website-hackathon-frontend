import React from 'react'
import { NextPage } from 'next'
import {
  Box,
  Heading,
  Text,
  Image,
  Link,
  SkeletonCircle,
  SkeletonText,
  Flex,
} from '@chakra-ui/react'

const FETCH_MEDIUM_FEED_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@w.xy020203'

interface MediumData {
  status: string
  feed: MediumFeed
  items: MediumItem[]
}

interface MediumFeed {
  url: string
  title: string
  link: string
  author: string
  description: string
  image: string
}

interface MediumItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: unknown
  categories: string[]
}

type BlogFetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export const Xiaoyun: NextPage = () => {
  const [blogData, setBlogState] = React.useState<MediumData | null>(null)
  const [fetching, setFetching] = React.useState<BlogFetchStatus>('idle')

  React.useEffect(() => {
    setFetching('loading')

    Promise.all([fetch(FETCH_MEDIUM_FEED_URL), new Promise((resolve) => setTimeout(resolve, 2200))])
      .then((response) => {
        return response[0].json()
      })
      .then((data) => {
        setBlogState(data)
        setFetching('succeeded')
      })
      .catch((error) => {
        setFetching('failed')
      })

    return () => {
      setFetching('idle')
      setBlogState(null)
    }
  }, [])

  if (!blogData || fetching == 'idle' || fetching == 'loading') {
    return (
      <Flex direction='column' align='center' w='100vw' maxW='1200px' mx='auto'>
        <Box padding='6' boxShadow='lg' bg='white' w='full'>
          <SkeletonCircle ml='4' size='10' />
          <SkeletonText mt='4' noOfLines={5} spacing='4' />
        </Box>
        <Box padding='6' boxShadow='lg' bg='white' w='full'>
          <SkeletonText mt='4' noOfLines={12} spacing='4' />
          <SkeletonText mt='4' noOfLines={12} spacing='4' />
          <SkeletonText mt='4' noOfLines={12} spacing='4' />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex direction='column' align='center' w='100vw' maxW='1200px' mx='auto'>
      <Box bg='gray.200' p={6} my={5} w='100%' shadow='md'>
        <Heading mx='auto' size='2xl' color='blue.600' fontWeight='bold'>
          {blogData.feed.title}
        </Heading>
        <Text mt={3} fontSize='lg' fontStyle='italic'>
          {blogData.feed.author}
        </Text>
        {blogData.feed.image && (
          <Image
            sizes='sm'
            src={blogData.feed.image}
            alt={blogData.feed.title}
            mt={3}
            borderRadius='full'
          />
        )}
        <Text mt={4}>{blogData.feed.description}</Text>
      </Box>
      {blogData.items.map((item) => (
        <Box
          key={item.guid}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
          p={5}
          m={3}
          w='100%'
          _hover={{ shadow: 'lg' }}
        >
          <Link href={item.link} isExternal w='100%'>
            <Heading size='lg' color='purple.500'>
              {item.title}
            </Heading>
          </Link>
          <Text fontSize='sm' color='gray.600'>
            {`Published on ${item.pubDate}`}
          </Text>
          <Image src={item.thumbnail} alt={item.title} mt={3} borderRadius='md' />
          {/* trust me bro */}
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </Box>
      ))}
    </Flex>
  )
}

export default Xiaoyun
