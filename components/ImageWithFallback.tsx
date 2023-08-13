import React, { useState } from 'react'
import { ImageProps } from 'next/image'
import { CldImage } from 'next-cloudinary'

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc: string
  src: string
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
  const { alt, src, fallbackSrc, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <CldImage
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}

export default ImageWithFallback
