import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const FooterMap = ({ google }: { google: any }) => {

  const center = {
    lat: 1.3069411221495004,
    lng: 103.77304736889802,
  };

  return (
    <>
      <Map google={google} initialCenter={center} zoom={15}>
        <Marker position={center} />
      </Map>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
})(FooterMap);
