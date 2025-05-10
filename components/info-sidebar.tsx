import { Button } from "@/components/ui/button";
import { FileUser, MapIcon } from "lucide-react";
import Link from "next/link";
import './info-sidebar.css'
import { act } from "@react-three/fiber";

// TODO: fix pointer events for the sidebar and setup a custom hidden or inactive variable.

interface InfoSideBarProps {
  active?: boolean
}

export function InfoSideBar({active}: InfoSideBarProps) {
    return (
    <div className="h-full box-border fixed top-0 right-0 z-999" id="sidebar">
        <div
          // id="sidebar"
          className={`${active ? "pointer-events-auto" : "pointer-events-none"} z-[2147483646] w-[300px] mt-[89px] inset-0 absolute h-[calc(100svh-89px)] box-border ml-auto right-0 p-4 pointer-events-none`}
        >
          <div style={{ backdropFilter: "blur(20px)", transition: "0.5s cubic-bezier(0.7, 0, 0.24, 0.99)" }} className={`${active ? "" : "sidebar-hidden"} flex flex-col justify-between h-full bg-white/80 w-full inset-0 p-4 box-border ml-auto right-0 border-1 border-[#e4e4e455] rounded-xl`}>
            <h1 className="text-2xl font-bold">Lorem Ipsum</h1>
            <div className="flex flex-col gap-2">
              <Link href="/enrol?id=ENG12">
                <Button variant={"outline"} className="w-full justify-start hover:gap-4 cursor-pointer">
                    <FileUser /> Enrol
                </Button>
              </Link>
              <Link href="/map">
                <Button variant={"outline"} className="w-full justify-start hover:gap-4 cursor-pointer">
                    <MapIcon /> Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}