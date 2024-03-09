import type { Icon, LatLngExpression } from 'leaflet'
import React, { useEffect, useState } from 'react'

import Map, { CustomMarkerProps, VenueMapProps } from './map'

// routing information obtained via http://map.project-osrm.org/
const yncToCinna: LatLngExpression[] = [
  [1.30799, 103.77168],
  [1.30795, 103.77168],
  [1.30789, 103.77166],
  [1.30789, 103.77166],
  [1.3079, 103.77185],
  [1.30789, 103.7719],
  [1.30788, 103.77193],
  [1.30788, 103.77193],
  [1.30773, 103.7719],
  [1.30773, 103.7719],
  [1.30768, 103.77235],
  [1.30752, 103.77233],
  [1.30752, 103.77233],
  [1.30751, 103.77235],
  [1.30741, 103.77242],
  [1.3072, 103.7724],
  [1.3072, 103.7724],
  [1.30713, 103.77284],
  [1.30713, 103.77284],
  [1.30706, 103.77284],
  [1.307, 103.77284],
  [1.30695, 103.77284],
  [1.30689, 103.77285],
  [1.30681, 103.77286],
  [1.30676, 103.77285],
  [1.30676, 103.77285],
  [1.30672, 103.77289],
  [1.30667, 103.77294],
  [1.30666, 103.77303],
  [1.30672, 103.77321],
  [1.30672, 103.77321],
  [1.30639, 103.7733],
  [1.30634, 103.77336],
]

const utownToCtph: LatLngExpression[] = [
  [1.30891, 103.77279],
  [1.30887, 103.77292],
  [1.30887, 103.77292],
  [1.30872, 103.77289],
  [1.30869, 103.77288],
  [1.30868, 103.77288],
  [1.30864, 103.77287],
  [1.30832, 103.77276],
  [1.30816, 103.77273],
  [1.30804, 103.7728],
  [1.30788, 103.77288],
  [1.30774, 103.77284],
  [1.30746, 103.7728],
  [1.3074, 103.77283],
  [1.30717, 103.77283],
  [1.30713, 103.77284],
  [1.30706, 103.77284],
  [1.30706, 103.77284],
  [1.30711, 103.77293],
  [1.30715, 103.77313],
]

const captToCtph: LatLngExpression[] = [
  [1.30715, 103.77313],
  [1.30688, 103.77319],
  [1.30689, 103.7733],
]

const tembuMphToUtownBus: LatLngExpression[] = [
  [1.30596, 103.77366],
  [1.30555, 103.77354],
  [1.3055, 103.77343],
  [1.30547, 103.77335],
  [1.30547, 103.77335],
  [1.30547, 103.7734],
  [1.30544, 103.77343],
  [1.30537, 103.77345],
  [1.30526, 103.77346],
  [1.3052, 103.77347],
  [1.30516, 103.77348],
  [1.30507, 103.7735],
  [1.30505, 103.77351],
  [1.305, 103.77353],
  [1.30483, 103.77359],
  [1.30476, 103.77365],
  [1.30461, 103.77373],
  [1.3045, 103.77377],
  [1.30436, 103.77375],
  [1.30428, 103.77372],
  [1.30428, 103.77372],
  [1.30422, 103.77372],
  [1.30404, 103.77385],
  [1.30399, 103.77388],
  [1.30386, 103.77397],
  [1.30365, 103.77411],
  [1.30342, 103.77421],
  [1.30342, 103.77421],
  [1.30346, 103.77431],
  [1.30346, 103.77431],
  [1.30355, 103.77444],
  [1.30355, 103.77444],
]

const diningToTembu: LatLngExpression[] = [
  [1.30634, 103.77336],
  [1.30609, 103.77347],
  [1.30596, 103.77366],
]

const diningToCtph: LatLngExpression[] = [
  [1.30672, 103.77321],
  [1.30689, 103.7733],
]

const DEFAULT_CENTER: LatLngExpression = [1.30669, 103.77344]

type markerInfo = {
  position: LatLngExpression
  popupMessage: string
  isShowPopup?: boolean
}

type polygonBounds = {
  bounds: LatLngExpression[]
}

type venueInfo = markerInfo & polygonBounds

const venues: venueInfo[] = [
  {
    position: [1.3067336768196218, 103.77347056901343],
    popupMessage: 'Cinnamon College',
    bounds: [
      [1.3071307, 103.773124],
      [1.3068614, 103.7728723],
      [1.3066952, 103.7730027],
      [1.3063825, 103.7730905],
      [1.3066676, 103.7737439],
      [1.3071818, 103.7735022],
      [1.3071307, 103.773124],
    ],
    isShowPopup: false, // default to false, because the map is too small to display a popup
  },
]

const privateTransportMarkers: markerInfo[] = [
  {
    position: [1.30691, 103.77353],
    popupMessage: 'Cinnamon College Drop-off point',
  },
  {
    position: [1.30511, 103.77196],
    popupMessage: 'Public parking at Stephen Riady Centre',
  },
  {
    position: [1.30384, 103.77341],
    popupMessage: 'Public parking at Create Tower',
  },
]

const publicTransportMarkers: markerInfo[] = [
  {
    position: [1.30355, 103.77444],
    popupMessage: 'NUS Internal shuttle bus stop',
  },
  {
    position: [1.30888, 103.77278],
    popupMessage: 'University Town bus stop',
  },
  {
    position: [1.30796, 103.7717],
    popupMessage: 'Yale-NUS bus stop',
  },
]

const VenueMap: React.FC = () => {
  // avoid rendering Tabulator in SSR
  const [isSsr, setIsSsr] = useState(true)
  useEffect(() => {
    setIsSsr(false)
  }, [])

  const venuesLength = venues.length

  return (
    <>
      {!isSsr && (
        <Map width='100%' height='100%' center={DEFAULT_CENTER} zoom={17}>
          {(
            { TileLayer, Polygon, Polyline }: VenueMapProps,
            TempIcon: typeof Icon,
            CustomMarker: React.FC<CustomMarkerProps>,
          ) => (
            <>
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {venues.map((venue, index) => (
                <div key={index}>
                  <CustomMarker
                    position={venue.position}
                    icon={
                      new TempIcon({
                        iconUrl: 'leaflet/blue-marker.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                    isShowPopup={!!venue.isShowPopup}
                    popupMessage={venue.popupMessage}
                  />
                  <Polygon positions={venue.bounds} />
                </div>
              ))}
              {privateTransportMarkers.map((marker, index) => {
                return (
                  <CustomMarker
                    key={venuesLength * 2 + index}
                    position={marker.position}
                    icon={
                      new TempIcon({
                        iconUrl: 'leaflet/red-marker.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                    isShowPopup={!!marker.isShowPopup}
                    popupMessage={marker.popupMessage}
                  />
                )
              })}
              {publicTransportMarkers.map((marker, index) => {
                return (
                  <CustomMarker
                    key={venuesLength * 3 + index}
                    position={marker.position}
                    icon={
                      new TempIcon({
                        iconUrl: 'leaflet/green-marker.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                    isShowPopup={!!marker.isShowPopup}
                    popupMessage={marker.popupMessage}
                  />
                )
              })}
              {
                <>
                  <Polyline positions={yncToCinna} pathOptions={{ color: 'green' }} />
                  <Polyline positions={utownToCtph} pathOptions={{ color: 'green' }} />
                  <Polyline positions={tembuMphToUtownBus} pathOptions={{ color: 'green' }} />
                  <Polyline positions={diningToTembu} pathOptions={{ color: 'green' }} />
                  <Polyline positions={diningToCtph} pathOptions={{ color: 'green' }} />
                  <Polyline positions={captToCtph} pathOptions={{ color: 'green' }} />
                </>
              }
            </>
          )}
        </Map>
      )}
    </>
  )
}

export default VenueMap
