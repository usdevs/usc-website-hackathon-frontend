import React from 'react';
import { Map, GoogleApiWrapper, Marker, IMapProps, IMarkerProps, GoogleAPI } from 'google-maps-react';

const FooterMap= ({ google }: { google: GoogleAPI }) => {

  const center : any = {
    lat: 1.3069411221495004,
    lng: 103.77304736889802,
  }

  const mapProps : IMapProps | any = {
    google: google,
    initialCenter: center,
    zoom: 15
  }

  const markerProps : IMarkerProps | any = {
    mapCenter: center
  }
  

  return (
    <>
      <Map {...mapProps}>
        <Marker {...markerProps} />
      </Map>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
})(FooterMap);
