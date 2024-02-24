import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.revalidate('/folio')

    const data = await req.body.json()
    if (data?.id) {
      await res.revalidate(`/folio/${data.id}`)
    }
  } catch (err) {
    console.error('Error revalidating:', err)
    return res.status(500).send('Error revalidating')
  }

  return res.json({ revalidated: true })
}
