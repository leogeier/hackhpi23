import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

function InvalidateOnLoad() {
  const map = useMap();
  useEffect(() => {map.invalidateSize(); console.log(map);}, []);

  return null;
}

export default function Map() {
  return (
    <div id='map' className='w-screen h-96'>
      <MapContainer center={[40.505, -100.09]} zoom={13} className='w-full h-full' >
      <InvalidateOnLoad/>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[40.505, -100.09]}>
              <Popup>
                I am a pop-up!
              </Popup>
          </Marker>
      </MapContainer>
 </div>
  );
}

