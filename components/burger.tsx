"use client"
 
import * as React from "react"
import { Book, BoxIcon, Camera, Contact, DollarSign, FileUser, HomeIcon, Info, MapIcon, MenuIcon, Minus, Package, Plus, TreePine } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"


function Burger() {
  return (
    <Drawer>
      <DrawerTrigger asChild className="burger" style={{ display: "none"}}>
        <Button variant="ghost">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full">
          <DrawerHeader hidden>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-4 w-full">
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant={"ghost"} asChild>
                <Link href='/' className="font-[500]">
                  <HomeIcon className="opacity-50 items-center flex justify-center" size={16} />
                  Home
                </Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant={"ghost"} asChild>
                <Link href='/map' className="font-[500]">
                  <MapIcon className="opacity-50 items-center flex justify-center" size={16} />
                  Site Map
                </Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant={"ghost"} asChild>
                <Link href='/enroll' className="font-[500]">
                  <FileUser className="opacity-50 items-center flex justify-center" size={16} />
                  Course Enrollment
                </Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant={"ghost"} asChild>
                <Link href='/' className="font-[500]">
                  <TreePine className="opacity-50 items-center flex justify-center" size={16} />
                  Virtual Tour
                </Link>
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { Burger }