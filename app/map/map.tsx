"use client";

import { GoogleMap, Marker } from '@react-google-maps/api';
import { useState, useRef } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Centre of school initial view
const initialCenter = {
  lat: -26.409034816004784,
  lng: 153.09985498109376,
};

// Calculate bounds for a 300-meter radius
const metersToDegrees = (meters: number, latitude: number) => {
  const latDelta = meters / 111000; // Convert meters to latitude degrees
  const lngDelta = meters / (111000 * Math.cos((latitude * Math.PI) / 180)); // Convert meters to longitude degrees
  return { latDelta, lngDelta };
};

const { latDelta, lngDelta } = metersToDegrees(300, initialCenter.lat);

const bounds = {
  north: initialCenter.lat + latDelta,
  south: initialCenter.lat - latDelta,
  east: initialCenter.lng + lngDelta,
  west: initialCenter.lng - lngDelta,
};

const nodes = [
  { id: 1, lat: -27.4698, lng: 153.0251, label: "Brisbane" },
  { id: 2, lat: -33.8688, lng: 151.2093, label: "Sydney" },
];

export default function MapComponent() {
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(18); // Initial zoom level
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(`Clicked location: Latitude: ${lat}, Longitude: ${lng}`);
    }
  };

  const handleOnLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleZoomChanged = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      setZoom(currentZoom || 0); // Update zoom state
      console.log(`Current zoom level: ${currentZoom}`);
    }
  };

  const mapOptions = {
    minZoom: 17, // Set minimum zoom level
    maxZoom: 21, // Set maximum zoom level
    restriction: {
      latLngBounds: bounds, // Restrict map movement within these bounds
      strictBounds: true,   // Prevent the user from panning outside the bounds
    },
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom} // Set initial zoom level
      onClick={handleMapClick} // Capture click events
      onLoad={handleOnLoad} // Capture map instance
      onZoomChanged={handleZoomChanged} // Log zoom level when it changes
      options={mapOptions} // Set min/max zoom levels and movement restriction
    >
      {nodes.map((node) => (
        <Marker
          key={node.id}
          position={{ lat: node.lat, lng: node.lng }}
          onClick={() => console.log(`Marker clicked: ${node.label}`)}
        />
      ))}
    </GoogleMap>
  );
}