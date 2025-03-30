"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Sphere, Html, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useState } from "react";

import { ArrowRight, Book, Building, CalendarIcon, FlaskConical, Info, MapIcon, NotebookPen, NotebookText, Paintbrush, Paintbrush2Icon, PenIcon } from "lucide-react"
 
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

function Panorama() {
  const texture = useLoader(TextureLoader, "/360_2.jpg"); // Replace with your image

  return (
    <Sphere args={[5, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={2} />
    </Sphere>
  );
}

export default function PanoramaScene() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="w-screen h-screen absolute top-0 right-0 box-border">
      <div className="h-full box-border relative">
        <div className="bg-white/80 z-[2147483647] w-[250px] inset-0 m-4 p-4 absolute box-border ml-auto right-0 border-1 border-[#e4e4e455] rounded-xl" style={{ backdropFilter: "blur(20px)" }}>
          <div className="flex flex-col justify-between h-full">
            <h1 className="text-2xl font-bold">B Block</h1>
            <div>
              <Link href="/map">
                <Button variant={'outline'} className="w-full">Back to map <MapIcon/></Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen h-screen absolute top-0">
        <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
          {/* Fix Inverted Dragging + Enable Zooming */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            rotateSpeed={-0.5} 
            zoomSpeed={2} 
            minDistance={0.1}  // Closest zoom-in level
            maxDistance={3}    // Farthest zoom-out level
          />

          {/* 360 Image */}
          <Panorama />

          {/* Clickable Button - B Block */}
          <Html position={[0, 0, -4.5]} center>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button className="cursor-pointer hover:scale-[1.1]" variant="outline">B Block</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex justify-between items-center space-x-4">
                  <FlaskConical size={48}/>
                  <div className="space-y-1">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold whitespace-nowrap">Science Block</h4>
                      <Badge variant={'outline'}>5 Subjects</Badge>
                    </div>
                    <p className="text-sm">
                      B block is where most of the science related classes are held.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Html>

          {/* Clickable Button - GS Block */}
          <Html position={[2, 1, -4]} center>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button className="cursor-pointer hover:scale-[1.1]" variant="outline">GS Block</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex justify-between items-center space-x-4">
                  <NotebookPen size={48}/>
                  <div className="space-y-1">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold whitespace-nowrap">Writing Block</h4>
                      <Badge variant={'outline'}>4 Subjects</Badge>
                    </div>
                    <p className="text-sm">
                      GS block is where most of the English and language-related classes are held.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Html>
        </Canvas>
      </div>
    </div>
  );
}
