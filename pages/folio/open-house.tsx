import Image from 'next/image'
import Folio1 from '../../public/folio-open-house/1.png'
import Folio2 from '../../public/folio-open-house/2.png'
import Folio3 from '../../public/folio-open-house/3.png'
import Folio4 from '../../public/folio-open-house/4.png'
import Folio5 from '../../public/folio-open-house/5.png'
import Folio6 from '../../public/folio-open-house/6.png'
import Carousel from '../../components/folio/Carousel'

export default function Page() {
  return <Carousel images={[Folio1, Folio2, Folio3, Folio4, Folio5, Folio6]}></Carousel>
}
