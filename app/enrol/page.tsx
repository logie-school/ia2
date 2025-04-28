"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Sphere, Html, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useState, useEffect } from "react";

import { Plus, SendIcon, User, XIcon } from "lucide-react"
 
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { motion } from "framer-motion"
import Loader from "@/components/loader"
import "@/components/nav-bar"
import { Navbar } from "@/components/nav-bar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

import './style.css'

export default function EnrolPage() {

    useEffect(() => {
        const handlePageLoad = () => {
          document.getElementById("loader")?.classList.add("opacity-0", "pointer-events-none");
        };
    
        if (document.readyState === "complete") {
          // If the page is already loaded
          handlePageLoad();
        } else {
          // Wait for the page to load
          window.addEventListener("load", handlePageLoad);
          return () => window.removeEventListener("load", handlePageLoad); // Cleanup listener
        }
      }, []);

  return (
    <div className="box-border bg-white">
      <Loader />
      <Navbar />
      <div>
        <div className="w-full mt-[89] p-16 absolute top-0 right-0 box-border overflow-hidden items-center justify-center flex flex-col gap-8">
            <div className="enrol-wrapper w-[600px] flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <span className="text-4xl font-bold">Course Enrolment</span>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/courses">English General</BreadcrumbLink>
                            </BreadcrumbItem>
                        <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>ENG12</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex flex-col gap-4 w-full items-center justify-between">
                    <div className="w-full bg-[#D9D9D9] p-4 flex flex-row gap-4 rounded-lg items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                            <User/>
                            <span className="font-medium">Name</span>
                            <span className="font-light opacity-50">•</span>
                            <span>Year 12</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-center">
                            <span className="opacity-50">1029485752</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="aspect-square w-6 items-center justify-center rounded-full flex flex-row hover:bg-[#000000]/10 cursor-pointer active:opacity-50">
                                        <XIcon size={16}/>
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Remove</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="w-full bg-[#D9D9D9] p-4 flex flex-row gap-4 rounded-lg items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                            <User/>
                            <span className="font-medium">Name</span>
                            <span className="font-light opacity-50">•</span>
                            <span>Year 9</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-center">
                            <span className="opacity-50">3958205593</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <div className="aspect-square w-6 items-center justify-center rounded-full flex flex-row hover:bg-[#000000]/10 cursor-pointer active:opacity-50">
                                        <XIcon size={16}/>
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Remove</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>




                    <div className="w-full p-4 flex flex-row gap-4 rounded-lg h-[56] items-center justify-between border-2 border-dashed hover:bg-accent cursor-pointer active:opacity-50 select-none">
                        <div className="flex flex-row items-center gap-2">
                            <Plus/>
                            <span className="font-medium">Add a student</span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-2 items-center justify-between">
                    <Button className="w-full bg-[#01615A] hover:bg-[#007d74] active:opacity-50 active:duration-[0]" variant={"default"}>
                        Submit
                        <SendIcon/>
                    </Button>
                    <span className="text-sm opacity-50">
                        By submitting you agree to the <Link href={'#'} className="hover:underline hover:decoration-solid active:opacity-50">Privacy Policy</Link> and <Link href={'#'} className="hover:underline hover:decoration-solid active:opacity-50">Terms</Link>.
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}