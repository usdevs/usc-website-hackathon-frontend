import Carousel from '@/components/stylio/Carousel'

import Newsletter1 from '@/public/newsletter/0001.jpg'
import Newsletter2 from '@/public/newsletter/0002.jpg'
import Newsletter3 from '@/public/newsletter/0003.jpg'
import Newsletter4 from '@/public/newsletter/0004.jpg'
import Newsletter5 from '@/public/newsletter/0005.jpg'
import Newsletter6 from '@/public/newsletter/0006.jpg'
import Newsletter7 from '@/public/newsletter/0007.jpg'
import Newsletter8 from '@/public/newsletter/0008.jpg'
import Newsletter9 from '@/public/newsletter/0009.jpg'
import Newsletter10 from '@/public/newsletter/0010.jpg'
import Newsletter11 from '@/public/newsletter/0011.jpg'
import Newsletter12 from '@/public/newsletter/0012.jpg'
import Newsletter13 from '@/public/newsletter/0013.jpg'

export default function Page() {
  return (
    <Carousel
      images={[
        Newsletter1,
        Newsletter2,
        Newsletter3,
        Newsletter4,
        Newsletter5,
        Newsletter6,
        Newsletter7,
        Newsletter8,
        Newsletter9,
        Newsletter10,
        Newsletter11,
        Newsletter12,
        Newsletter13,
      ]}
      title={'NUSC Newsletter'}
    />
  )
}
