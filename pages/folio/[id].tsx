import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import { z } from 'zod'
import Markdown from 'react-markdown'
import {
  Box,
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import FolioPageBg from '../../public/folio-header.png'
import Image from 'next/image'

const schema = z.array(
  z
    .object({
      id: z.number(),
    })
    .passthrough(),
)

export const getStaticPaths = (async () => {
  const data = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/submissions/all').then(
    (res) => res.json(),
  )
  const submissions = schema.parse(data)
  const paths = submissions.map((submission) => ({
    params: { id: submission.id.toString() },
  }))
  return { paths, fallback: true }
}) satisfies GetStaticPaths

export const getStaticProps: GetStaticProps<{
  submission: FolioDetailedSubmission
}> = async (context) => {
  const params = context.params
  const id = params?.id
  if (typeof id !== 'string') {
    throw new Error('id is not a string')
  }
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'folio/submissions/all')
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`)
    }
    const data = await response.json()
    const submissions = data as FolioDetailedSubmission[]
    const submission = submissions.find((submission) => submission.id === parseInt(id))
    if (!submission) {
      throw new Error('submission not found')
    }
    return { props: { submission } }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

const FOLIO_FONT_FAMILY = 'Times New Roman'

// Define your custom typography components
const H1 = ({ children }: { children: ReactNode }) => (
  <Heading as='h1' size='xl' my={6} fontFamily={FOLIO_FONT_FAMILY}>
    {children}
  </Heading>
)
const H2 = ({ children }: { children: ReactNode }) => (
  <Heading as='h2' size='lg' my={4} fontFamily={FOLIO_FONT_FAMILY}>
    {children}
  </Heading>
)

const H3 = ({ children }: { children: ReactNode }) => (
  <Heading as='h3' size='md' my={2} fontFamily={FOLIO_FONT_FAMILY}>
    {children}
  </Heading>
)

const P = ({ children }: { children: ReactNode }) => (
  <Text as='p' fontSize={{ base: 'lg', md: 'xl' }}>
    {children}
  </Text>
)

const A = ({ href, children }: { children: ReactNode; href: string }) => (
  <Link
    href={href}
    color='teal.500'
    fontFamily={FOLIO_FONT_FAMILY}
    fontSize={{ base: 'lg', md: 'xl' }}
  >
    {children}
  </Link>
)

const Li = ({ children }: { children: ReactNode }) => (
  <ListItem fontSize={{ base: 'lg', md: 'xl' }} fontFamily={FOLIO_FONT_FAMILY}>
    {children}
  </ListItem>
)

const Ul = ({ children }: { children: ReactNode }) => (
  <UnorderedList fontFamily={FOLIO_FONT_FAMILY}>{children}</UnorderedList>
)

// Create a custom renderer for each Markdown element type
export default function Page({ submission }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!submission) {
    console.error('No submission found')
    return null
  }
  const { title, text, lastUpdated } = submission
  const { name: studentName } = submission.student

  return (
    <Box width='100%' fontFamily={FOLIO_FONT_FAMILY} mb={16}>
      <Image
        src={FolioPageBg}
        alt='Folio Page Background'
        sizes='100vw'
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      <Center w='100%' pt={{ base: 0, xl: 8 }}>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', xl: 'repeat(5, 1fr)' }}
          columnGap={4}
          w={{ base: '100%', lg: '80%' }}
        >
          <GridItem colSpan={2}>
            <Box position='sticky' top={8} px={{ base: 2, md: 4 }} bg='white' w='100%'>
              <Heading as='h1' size='2xl' mt='8'>
                {title}
              </Heading>
              <Text mt='4' fontStyle={'italic'} fontSize='lg'>
                By {studentName}
              </Text>
              <Divider mt='2' />
            </Box>
          </GridItem>
          <GridItem colSpan={3}>
            <Box flex='3' px={{ base: 2, md: 4 }}>
              <Markdown
                components={{
                  h1(props) {
                    return <H1>{props.children}</H1>
                  },
                  h2(props) {
                    return <H2>{props.children}</H2>
                  },
                  h3(props) {
                    return <H3>{props.children}</H3>
                  },
                  text(props) {
                    return <P>{props.children}</P>
                  },
                  p(props) {
                    return <P>{props.children}</P>
                  },
                  link(props) {
                    return <A href={props.href ?? ''}>{props.children}</A>
                  },
                  li(props) {
                    return <Li>{props.children}</Li>
                  },
                  ul(props) {
                    return <Ul>{props.children}</Ul>
                  },
                }}
              >
                {text}
              </Markdown>
            </Box>
          </GridItem>
        </Grid>
      </Center>
    </Box>
  )
}
