import { Button } from "@/components/ui/button";
import { FileUser, MapIcon } from "lucide-react";
import Link from "next/link";
import './info-sidebar.css'

export function InfoSideBar() {
    return (
    <div className="h-full box-border relative">
        <div
          id="sidebar"
          className="bg-white/80 z-[2147483646] w-[250px] inset-0 m-4 p-4 absolute box-border ml-auto right-0 border-1 border-[#e4e4e455] rounded-xl sidebar-hidden"
          style={{ backdropFilter: "blur(20px)", transition: "0.5s cubic-bezier(0.7, 0, 0.24, 0.99)" }}
        >
          <div className="flex flex-col justify-between h-full">
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