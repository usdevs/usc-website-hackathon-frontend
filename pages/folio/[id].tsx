import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import { z } from 'zod'
import Markdown from 'react-markdown'
import { Box, Center, Heading, Link, Text } from '@chakra-ui/react'
import { PropsWithChildren, ReactNode } from 'react'
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
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'submissions/all')
  const submissions = schema.parse(await res.json())
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

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'submissions/all')
  // TODO: add validation
  const submissions = (await res.json()) as FolioDetailedSubmission[]
  const submission = submissions.find((submission) => submission.id === parseInt(id))
  if (!submission) {
    throw new Error('submission not found')
  }

  return { props: { submission } }
}
// Define your custom typography components
const H1 = ({ children }: { children: ReactNode }) => (
  <Heading as='h1' size='2xl' mt='8'>
    {children}
  </Heading>
)
const H2 = ({ children }: { children: ReactNode }) => (
  <Heading as='h2' size='xl' mt='6'>
    {children}
  </Heading>
)
const P = ({ children }: { children: ReactNode }) => (
  <Text as='p' mt={4}>
    {children}
  </Text>
)
const A = ({ href, children }: { children: ReactNode; href: string }) => (
  <Link href={href} color='teal.500'>
    {children}
  </Link>
)

// Create a custom renderer for each Markdown element type
export default function Page({ submission }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { title, text, lastUpdated } = submission
  const { name: studentName } = submission.student

  const textWithTitle = `# ${title}\n\n*By ${studentName}*\n\n${text}`

  return (
    <Box width='100vw' style={{ position: 'relative' }}>
      <Image
        src={FolioPageBg}
        alt='Folio Page Background'
        sizes='100vw'
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      <Box style={{ maxWidth: '640px' }} mx='auto' mb={16}>
        <Markdown
          components={{
            h1(props) {
              return <H1>{props.children}</H1>
            },
            h2(props) {
              return <H2>{props.children}</H2>
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
          }}
        >
          {textWithTitle}
        </Markdown>
      </Box>
    </Box>
  )
}
