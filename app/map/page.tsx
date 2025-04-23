"use client";

import dynamic from 'next/dynamic';
import { LoadScript } from '@react-google-maps/api';
import './style.css'

const MapComponent = dynamic(() => import('./map'), { ssr: false });

export default function Page() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao">
      <div style={{ width: '100svw', height: '100svh' }}>
        <MapComponent />
      </div>
    </LoadScript>
  );
}