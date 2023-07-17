import React, { useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc: string
  src: string
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
  const { alt, src, fallbackSrc, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)
  const [priority, setPriority] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch(src)
      if (res.status == 404) {
        setImgSrc(fallbackSrc)
        setPriority(true)
      }
    })()
  }, [fallbackSrc, src])

  return (
    <Image
      {...rest}
      src={imgSrc}
      priority={priority}
      alt={alt}
    />
  )
}

export default ImageWithFallback
