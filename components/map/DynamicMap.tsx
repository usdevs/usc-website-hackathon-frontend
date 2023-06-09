import * as L from 'leaflet'
import React, { CSSProperties, useEffect, useRef } from 'react'
import * as ReactLeaflet from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility'
import { Marker, Popup } from 'react-leaflet'

import { CustomMarkerProps, LeafletComponents } from './index'

// FIXME need to fix this for mobile, original values for width and height were 100% and providing these values is a
//  must for leaflet to work. But with 100%  the map is not visible because parent container has no height(?)
const style: CSSProperties = {
  height: '20vh',
  width: '20vw',
}

interface DynamicMapProps {
  children: LeafletComponents
}

const { MapContainer } = ReactLeaflet

const DynamicMap = ({ children, ...rest }: DynamicMapProps) => {
  return (
    <MapContainer {...rest} style={style}>
      {children(ReactLeaflet, L.Icon, CustomMarker)}
    </MapContainer>
  )
}

const CustomMarker: React.FC<CustomMarkerProps> = (props) => {
  const markerRef = useRef<L.Marker>(null)
  useEffect(() => {
    const marker = markerRef.current
    if (marker && props.isShowPopup) {
      marker.openPopup()
    }
  }, [props.isShowPopup])

  return (
    <Marker ref={markerRef} key={props.hkey} position={props.position} icon={props.icon}>
      <Popup autoClose={false}>
        {props.popupMessage}
        <a
          href={'https://www.google.com/maps/search/?api=1&query=' + props.position.toString()}
          target='_blank'
          rel='noopener noreferrer'
        >
          {' '}
          (view on Google Maps)
        </a>
      </Popup>
    </Marker>
  )
}

export default DynamicMap
