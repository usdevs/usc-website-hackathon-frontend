import Carousel from '@/components/stylio/Carousel'

import Stylio1 from '@/public/stylio-open-house/1.png'
import Stylio2 from '@/public/stylio-open-house/2.png'
import Stylio3 from '@/public/stylio-open-house/3.png'
import Stylio4 from '@/public/stylio-open-house/4.png'
import Stylio5 from '@/public/stylio-open-house/5.png'
import Stylio6 from '@/public/stylio-open-house/6.png'

export default function Page() {
  return (
    <Carousel images={[Stylio1, Stylio2, Stylio3, Stylio4, Stylio5, Stylio6]} title={'Stylio'} />
  )
}
