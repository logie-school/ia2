"use client";

import dynamic from 'next/dynamic';
import { LoadScript } from '@react-google-maps/api';
import './style.css';
import Loader from '@/components/loader';
import { useEffect, useState } from 'react';

const MapComponent = dynamic(() => import('./map'), { ssr: false });

export default function Page() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (isMapLoaded) {
      console.log('Page has fully loaded');
      document.getElementById("loader")?.classList.add("opacity-0", "pointer-events-none");
    }
  }, [isMapLoaded]);

  const handleMapIdle = () => {
    console.log('Google Maps has finished rendering (idle event)');
    setIsMapLoaded(true);
  };

  return (
    <>
      <Loader />
      <LoadScript
        googleMapsApiKey="AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao"
      >
        <div style={{ width: '100svw', height: '100svh' }}>
          <MapComponent onIdle={handleMapIdle} />
        </div>
      </LoadScript>
    </>
  );
}