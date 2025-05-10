"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Loader from "@/components/loader"
import { useState, useEffect } from "react";
import { Navbar } from "@/components/nav-bar"
import { motion } from "framer-motion"

export default function Page() {

  let [loaded, setLoaded] = useState(false);

  useEffect(() => {
      const handlePageLoad = () => {
        document.getElementById("loader")?.classList.add("opacity-0", "pointer-events-none");
        setLoaded(true);
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
    <div className="flex mt-[89px]">
      <Navbar />
      <Loader />

      <motion.div
        initial={{ opacity: 0, pointerEvents: "none" }} 
        animate={{ opacity: 1, pointerEvents: "all" }} 
        transition={{ duration: 1, ease: [.7,0,.24,.99], delay: 0.5 }} 
        className="w-full h-full"
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </motion.div>
    </div>
  )
}
