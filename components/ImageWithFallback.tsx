import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc: string
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
  const { alt, src, fallbackSrc, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)
  const [priority, setPriority] = useState<boolean>(false)

  return (
    <Image
      {...rest}
      src={imgSrc}
      priority={priority}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
        setPriority(true)
      }}
    />
  )
}

export default ImageWithFallback
