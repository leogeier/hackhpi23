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
  const map = useMap();
  fetch("/api/streets")
  .then(function(response) {
    return response.json();
  }).then(function(data) {
    const example_object = JSON.parse(data);
    L.geoJSON(example_object, {
      style: function(feature) {
        return {color: feature.properties.stroke, weight: feature.properties["stroke-width"], opacity: feature.properties["stroke-opacity"]} 
      }
    }).addTo(map);

  }).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  
  return null;
}

function InvalidateOnLoad() {
  const map = useMap();
  useEffect(() => {map.invalidateSize(); console.log(map);}, []);

  return null;
}

function LoadImageMarkers() {
  const map = useMap();
  fetch("http://localhost:5000/photos")
  .then(function(response) {
    return response.json();
  }).then(function(data) {
    const example_object = JSON.parse(data);
    L.geoJSON(example_object, {
      style: function(feature) {
        return {color: feature.properties.stroke, weight: feature.properties["stroke-width"], opacity: feature.properties["stroke-opacity"]} 
      },
      onEachFeature: async function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.filenames) {
            const image = new Image(300, 300)
            const imageData = await fetchPhoto(feature.properties.filenames)
            image.src = imageData.url
            layer.bindPopup(image, {minWidth: 300});
        }
    }
    }).addTo(map);
  }).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  
  return null;
}

async function fetchPhoto(filename) {
  return fetch("http://localhost:5000/static/" + filename)
  .then(function(response) {
    return response;
  }).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

export default function Map() {
  

  return (
    <div id='map' className='w-full h-full fixed top-16 left-0 -z-10'>
      <MapContainer center={fallback} zoom={17} >
        <InvalidateOnLoad/>
        <LocationMarker />
        <LoadStreets/>
        <LoadImageMarkers/>

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

