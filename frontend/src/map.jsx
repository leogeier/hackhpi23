import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import * as L from "leaflet";

const fallback = [52.39213645214943, 13.123381806173398]

function LocationMarker() {
  const [position, setPosition] = useState(null)

  let map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng)
      map.setView(e.latlng);
    });
  }, [map]);

  return (
    <Marker position={position ?? fallback}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

function LoadStreets() {

  const example_json = `{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "stroke": "#ff2d28",
          "stroke-width": 2,
          "stroke-opacity": 1
        },
        "geometry": {
          "coordinates": [
            [8.910232129914675, 50.14536687853564],
            [8.911144597334612, 50.14742157191719],
            [8.911524792092678, 50.14826616335989]
          ],
          "type": "LineString"
        },
        "id": 0
      },
      {
        "type": "Feature",
        "properties": {
          "stroke": "#10ff00",
          "stroke-width": 2,
          "stroke-opacity": 1
        },
        "geometry": {
          "coordinates": [
            [8.908811602572115, 50.14699078160584],
            [8.910979915141581, 50.1469691551643]
          ],
          "type": "LineString"
        },
        "id": 1
      }
    ]
  }`;
  
  const example_object = JSON.parse(example_json);
  const map = useMap();
  L.geoJSON(example_object).addTo(map);
  
  return null;
}

function InvalidateOnLoad() {
  const map = useMap();
  useEffect(() => {map.invalidateSize(); console.log(map);}, []);

  return null;
}

export default function Map() {
  

  return (
    <div id='map' className='w-screen h-96'>
      <MapContainer center={fallback} zoom={13} className='w-full h-full' >
        <InvalidateOnLoad/>
        <LocationMarker />
        <LoadStreets/>

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer
          attribution='&copy; <a href="https://www.flaticon.com/de/kostenlose-icons/zigarre" title="zigarre Icons">Zigarre Icons erstellt von Freepik - Flaticon</a>'
          url="https://www.flaticon.com/de/kostenlose-icons/zigarre"
        />
      </MapContainer>
 </div>
  );
}

