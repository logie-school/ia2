"use client";

import { GoogleMap, Marker } from '@react-google-maps/api';
import { useState, useRef, useEffect } from 'react';
import { Book, BookOpenTextIcon, VolleyballIcon, ArrowLeft, HomeIcon, CircleHelp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PanoNode } from "@/components/pano-node";
import { InfoNode } from "@/components/info-node";
import { CustomNode } from '@/components/custom-node';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InfoSideBar } from '@/components/info-sidebar';
import Link from 'next/link';
import { Navbar } from '@/components/nav-bar';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Centre of school initial view
const initialCenter = {
  lat: -26.409098044004523,
  lng: 153.09898862758197,
};

// Calculate bounds for a 300-meter radius
const metersToDegrees = (meters: number, latitude: number) => {
  const latDelta = meters / 111000; // Convert meters to latitude degrees
  const lngDelta = meters / (111000 * Math.cos((latitude * Math.PI) / 180)); // Convert meters to longitude degrees
  return { latDelta, lngDelta };
};

const { latDelta, lngDelta } = metersToDegrees(1000, initialCenter.lat);

const bounds = {
  north: initialCenter.lat + latDelta,
  south: initialCenter.lat - latDelta,
  east: initialCenter.lng + lngDelta,
  west: initialCenter.lng - lngDelta,
};

// Suppress specific Google Maps API errors
const originalConsoleError = console.error;

console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('BillingNotEnabledMapError')
  ) {
    // Ignore the BillingNotEnabledMapError
    return;
  }
  // Call the original console.error for other errors
  originalConsoleError(...args);
};

export default function MapComponent({ onIdle }: { onIdle?: () => void }) {
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(19); // Initial zoom level
  const [minZoom, setMinZoom] = useState(15); // Configurable minimum zoom level
  const [maxZoom, setMaxZoom] = useState(21); // Configurable maximum zoom level
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>(() => {
    return (localStorage.getItem('mapType') as 'roadmap' | 'satellite') || 'satellite';
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to track sheet open status
  let [activeNode, setActiveNode] = useState<string | null>(null); // State to track active node

  useEffect(() => {
    // Save the map type to localStorage whenever it changes
    localStorage.setItem('mapType', mapType);
  }, [mapType]);

  useEffect(() => {
    // Function to remove elements containing the target text
    const removeElements = () => {
      const elements = document.querySelectorAll('span');
      elements.forEach((element) => {
        if (element.textContent?.trim() === 'For development purposes only') {
          element.remove();
        }
      });
    };

    // Initial cleanup
    removeElements();

    // Set up a MutationObserver to watch for dynamically added elements
    const observer = new MutationObserver(() => {
      removeElements();
    });

    // Observe changes in the DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log('Page has fully loaded.');
  }, []);

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
      if (currentZoom !== undefined) {
        if (currentZoom < minZoom) {
          mapRef.current.setZoom(minZoom); // Force zoom to minZoom
          setZoom(minZoom);
          console.warn(`Zoom level adjusted to minZoom (${minZoom}).`);
        } else if (currentZoom > maxZoom) {
          mapRef.current.setZoom(maxZoom); // Force zoom to maxZoom
          setZoom(maxZoom);
          console.warn(`Zoom level adjusted to maxZoom (${maxZoom}).`);
        } else {
          setZoom(currentZoom); // Update zoom state
          console.log(`Current zoom level: ${currentZoom}`);
        }
      }
    }
  };

  const mapOptions = {
    minZoom, // Use the state variable for minimum zoom
    maxZoom, // Use the state variable for maximum zoom
    restriction: {
      latLngBounds: bounds, // Restrict map movement within these bounds
      strictBounds: true,   // Prevent the user from panning outside the bounds
    },
    mapTypeId: mapType, // Set the map type
    disableDoubleClickZoom: true
  };

  console.log('Map options:', mapOptions);

  const handleIdle = () => {
    console.log('Map is idle.');
    if (onIdle) {
      onIdle(); // Call the passed onIdle function
    }
  };

  return (

    <div className='overflow-hidden'>

    <InfoSideBar />
    <Navbar bgColor='#fff' hidden={isSheetOpen} />

    <div className='absolute top-0 overflow-hidden' style={{ width: '100svw', height: '100svh' }}>

      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 49, transition: "1s cubic-bezier(.7,0,.24,.99)" }} className={`flex gap-2 flex-row mt-[89px] ${isSheetOpen ? "!mt-0" : ""}`} >
        <Sheet onOpenChange={(open) => setIsSheetOpen(open)}>
          <SheetTrigger asChild>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={'outline'}>
                      <CircleHelp />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Help</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </SheetTrigger>
          <SheetContent className="rounded-2xl">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">Map Help</SheetTitle>
              <SheetDescription>
                Learn and understand how to use the map.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 p-4">
              <div className="items-center gap-4">
                <Label className="text-right text-lg">How do I navigate the map?</Label>
                <span className="opacity-50 text-sm">
                  Click and drag to move the view and scroll to zoom in and out.
                </span>
              </div>
              <div className="items-center gap-4">
                <Label className="text-right text-lg">What are these circles?</Label>
                <span className="opacity-50 text-sm">
                  The circles are clickable nodes which have different uses, a camera
                  icon is a 360° image, a letter indicates what block and all of the
                  other nodes are custom nodes, hover on the nodes for more information.
                </span>
              </div>
              <div className="items-center gap-4">
                <Label className="text-right text-lg">What is the map view dropdown?</Label>
                <span className="opacity-50 text-sm">
                  The map view dropdown is located in the top left corner of the map, it
                  allows you to switch between the map and satellite view.
                </span>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild></SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Select
          value={mapType}
          onValueChange={(value) => setMapType(value as 'roadmap' | 'satellite')}
        >
          <SelectTrigger>
            <SelectValue>{mapType === 'roadmap' ? 'Map View' : 'Satellite View'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="roadmap">Map View</SelectItem>
            <SelectItem value="satellite">Satellite View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 49 }}>
        
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom} // Set initial zoom level
        onClick={handleMapClick} // Capture click events
        onLoad={handleOnLoad} // Capture map instance
        onZoomChanged={handleZoomChanged} // Log zoom level when it changes
        options={mapOptions} // Set min/max zoom levels and movement restriction
        onIdle={handleIdle} // Pass the handler here
      >
        <PanoNode position={{ lat: -26.4095080970424, lng: 153.09906042235346 }} href='/pano' />

        {/* i need to put this data in a database later on instead of using the website. */}
        <InfoNode position={{ lat: -26.409631004423808, lng: 153.09882796891992 }} nodeLetter='I' title='I Block' description='Junior classrooms and senior exam block, newest block.' type='School classrooms' />
        <InfoNode position={{ lat: -26.409233438867815, lng: 153.0988770611079 }} nodeLetter='K' title='K Block' description='Learnig support block.' type='School classrooms' />
        <InfoNode position={{ lat: -26.40969740646617, lng: 153.09934078533985 }} nodeLetter='J' title='J Block' description='Mathematics block.' type='School classrooms' />
        <InfoNode position={{ lat: -26.40928450445418, lng: 153.09928638704162 }} nodeLetter='GS' title='GS Block' description='English and writing block.' type='School classrooms' />
        <InfoNode position={{ lat: -26.409674473435988, lng: 153.09982825007637 }} nodeLetter='C' title='C Block' description='Italian and support block.' type='School classrooms' />
        <InfoNode position={{ lat: -26.409222174594248, lng: 153.1003212789107 }} nodeLetter='B' title='B Block' description='Science block.' type='School classrooms' href='/enrol?faculty=Science' />

        <CustomNode position={{ lat: -26.408705184759523, lng: 153.0989981543763 }} title='Backetball Courts' description='Two full size undercover courts.' type='Sports facility' bgColor='#c76300' fgColor='#fff'>
          <VolleyballIcon/>
        </CustomNode>

        <CustomNode position={{ lat: -26.409235890126865, lng: 153.09982243545247 }} title='Resource Centre' description='Students can borrow resources and get tech help.' type='Resource facility' bgColor='#c76300' fgColor='#fff'>
          <BookOpenTextIcon/>
        </CustomNode>


      </GoogleMap>
      </div>

    </div>
    
    
  );
}