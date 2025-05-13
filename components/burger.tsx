"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, HomeIcon, MapIcon, FileUser, BookMarked, TreePine, LogIn, MenuIcon, ShieldIcon, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"

function Burger() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])) // Decode JWT payload
        setUserEmail(decoded.email)
        setIsLoggedIn(true)
        setIsAdmin(decoded.role <= 3) // Check if the user is an admin
      } catch (error) {
        console.error("Error decoding token:", error)
        setIsLoggedIn(false)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setUserEmail(null)
    router.push("/")
    location.reload()
  }

  return (
    <Drawer>
      <DrawerTrigger asChild className="burger">
        <Button variant="ghost">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Navigate through the site.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-4 w-full">
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant="ghost" asChild>
                <Link href="/" className="font-[500]">
                  <HomeIcon className="opacity-50 items-center flex justify-center" size={16} />
                  Home
                </Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant="ghost" asChild>
                <Link href="/map" className="font-[500]">
                  <MapIcon className="opacity-50 items-center flex justify-center" size={16} />
                  Site Map
                </Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant="ghost" asChild>
                <Link href="/enrol" className="font-[500]">
                  <FileUser className="opacity-50 items-center flex justify-center" size={16} />
                  Course Enrollment
                </Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant="ghost" asChild>
                <Link href="/pano" className="font-[500]">
                  <TreePine className="opacity-50 items-center flex justify-center" size={16} />
                  Virtual Tour
                </Link>
              </Button>
            </DrawerClose>
            {isAdmin && (
              <DrawerClose asChild>
                <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant="ghost" asChild>
                  <Link href="/admin" className="font-[500]">
                    <ShieldIcon className="opacity-50 items-center flex justify-center" size={16} />
                    Admin Page
                  </Link>
                </Button>
              </DrawerClose>
            )}
            {isLoggedIn ? (
              <>
                <DrawerClose asChild>
                  <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant="ghost" asChild>
                    <Link href="/reset-password" className="font-[500]">
                      <RotateCcw className="opacity-50 items-center flex justify-center" size={16} />
                      Reset Password
                    </Link>
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    className="flex flex-row gap-2 items-center justify-start burger-item"
                    variant="ghost"
                    onClick={handleLogout}
                  >
                    <LogOut className="opacity-50 items-center flex justify-center" size={16} />
                    Logout
                  </Button>
                </DrawerClose>
              </>
            ) : (
              <DrawerClose asChild>
                <Button className="flex flex-row gap-2 items-center justify-start burger-item" variant="ghost" asChild>
                  <Link href="/login" className="font-[500]">
                    <LogIn className="opacity-50 items-center flex justify-center" size={16} />
                    Login
                  </Link>
                </Button>
              </DrawerClose>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { Burger }