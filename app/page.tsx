"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Sphere, Html, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useState, useEffect } from "react";

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
import { motion } from "framer-motion"
import './pano.css'

function Panorama({ onLoad }: { onLoad: () => void }) {
  const texture = useLoader(TextureLoader, "/360_2.jpg");

  useEffect(() => {
    if (texture.image) {
      onLoad();
    }
  }, [texture, onLoad]);

  return (
    <Sphere args={[5, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={2} />
    </Sphere>
  );
}

export default function PanoramaScene() {
  let sidebarHideen = true;

  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
    document.getElementById("loader")?.classList.add("opacity-0", "pointer-events-none");
    console.log("Panorama image has fully loaded and is ready to render.");
  };

  return (
    <div className="w-[100svw] h-[100svh] absolute top-0 right-0 box-border overflow-hidden">
      <div id="loader" style={{ transition: '0.5s' }} className="select-none w-screen h-screen absolute top-0 right-0 bg-[#dddddd] z-[2147483647] flex items-center justify-center">
        <div className="loader"></div>
        <span className="absolute translate-y-20 opacity-50 font-mono">loading</span>
      </div>
      <div className="h-full box-border relative">
        <div
          id="sidebar"
          className="bg-white/80 z-[2147483646] w-[250px] inset-0 m-4 p-4 absolute box-border ml-auto right-0 border-1 border-[#e4e4e455] rounded-xl sidebar-hidden"
          style={{ backdropFilter: "blur(20px)", transition: "0.5s cubic-bezier(0.7, 0, 0.24, 0.99)" }}
        >
          <div className="flex flex-col justify-between h-full">
            <h1 className="text-2xl font-bold">GS Block</h1>
            <div>
              <Link href="/map">
                <Button variant={"outline"} className="w-full">
                  Back to map <MapIcon />
                </Button>
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
            minDistance={0.1} // Closest zoom-in level
            maxDistance={3} // Farthest zoom-out level
          />

          {/* 360 Image */}
          <Panorama onLoad={handleImageLoad} />

          {/* Clickable Button - B Block */}
          <Html position={[0, 0, -4.5]} center>
            <motion.div initial={{ opacity: 0, scale: 0.5  }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.7, 0, 0.24, 0.99] }}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="cursor-pointer hover:scale-[1.1]" variant="outline">
                    B Block
                    <FlaskConical />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex justify-between items-center space-x-4">
                    <FlaskConical size={48} />
                    <div className="space-y-1">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold whitespace-nowrap">Science Block</h4>
                        <Badge variant={"outline"}>5 Subjects</Badge>
                      </div>
                      <p className="text-sm">
                        B block is where most of the science related classes are held.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          </Html>

          {/* Clickable Button - GS Block */}
          <Html position={[2, 1, -4]} center>
            <motion.div initial={{ opacity: 0, scale: 0.5  }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.7, 0, 0.24, 0.99] }}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    className="cursor-pointer hover:scale-[1.1]" 
                    variant="outline" 
                    onClick={() => {
                      const sidebar = document.getElementById("sidebar");
                      if (sidebar) {
                        sidebar.classList.remove("sidebar-hidden");
                        // setup a database query here to get the sidebar data and then assign the data
                      }
                    }}
                    >
                    GS Block
                    <NotebookPen />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex justify-between items-center space-x-4">
                    <NotebookPen size={48} />
                    <div className="space-y-1">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold whitespace-nowrap">Writing Block</h4>
                        <Badge variant={"outline"}>4 Subjects</Badge>
                      </div>
                      <p className="text-sm">
                        GS block is where most of the English and language-related classes are held.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          </Html>
        </Canvas>
      </div>
    </div>
  );
}
