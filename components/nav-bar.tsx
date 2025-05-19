"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Burger } from "@/components/burger"
import { motion } from "framer-motion"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import './nav-bar.css'
import { LogOut, User, ShieldIcon, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface NavbarProps {
  bgColor?: string
  hidden?: boolean
  topmost?: boolean
}

function Navbar({ bgColor, hidden, topmost }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin , setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const refreshUserToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/refresh-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          const result = await response.json();

          if (response.ok) {
            localStorage.setItem("token", result.token); // Update the token in localStorage
            const newToken = result.token;
            const payload = newToken.split(".")[1];
            // Add padding if needed for base64
            const padded = payload + "=".repeat((4 - payload.length % 4) % 4);
            const decoded = JSON.parse(atob(padded));
            setUserEmail(decoded.email);
            setIsLoggedIn(true);
            setIsAdmin(decoded.role <= 3);
          } else {
            console.error(result.message);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    };

    refreshUserToken();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length !== 3 || !parts[1]) throw new Error("Malformed token");
        const payload = parts[1];
        const padded = payload + "=".repeat((4 - payload.length % 4) % 4);
        const decoded = JSON.parse(atob(padded));
        if (!decoded.email) throw new Error("Malformed token payload");
        setUserEmail(decoded.email);
        setIsLoggedIn(true);
        setIsAdmin(decoded.role <= 3);
      } catch (error) {
        // Remove token and reset state
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserEmail(null);
        setIsAdmin(false);
        // Show a toast or alert
        toast.error("Invalid or tampered token. Please log in again.");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setUserEmail(null)
    location.reload()
  }

  return (
    <motion.div
      className={`z-[999] w-screen mx-auto border-b-1 shadow-xl p-3 justify-center flex-row flex items-center fixed top-0 left-0 bg-background/50 backdrop-blur-sm nav ${hidden || ""}  ${
        topmost ? "z-[2147483646]" : "z-[999]"
      }`}
      suppressHydrationWarning
      initial={{ opacity: 0, y: -60 }}
      animate={
        hidden
          ? { opacity: 0, y: -60, pointerEvents: "none" }
          : { opacity: 1, y: 0, pointerEvents: "all" }
      }
      transition={{ duration: 1, ease: [0.7, 0, 0.24, 0.99], delay: 0 }}
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[80%] flex items-center justify-between nav-bar">
        <a
          className="nav-logo font-bold text-xl flex flex-row items-center gap-4"
          href="/"
        >
          <img
            src="/sbshs.webp"
            alt="logo"
            className="nav-img aspect-square h-[64px]"
            style={{ filter: "drop-shadow(0 0 10px #0005)" }}
          />
          <span className="text-2xl font-bold text-primary nav-title">
            Sunshine Beach State High School
          </span>
        </a>
        <Burger />
        <NavigationMenu className="nav-buttons">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/#home" legacyBehavior passHref>
                <NavigationMenuLink className={"bg-transparent"}>
                  <span className="font-medium">Home</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">
                Explore
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-3 md:w-[300px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md justify-center"
                        href="/map"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Site Map
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Easily get familiar with the layout of the school.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/enrol" title="Course Enrolment">
                    Enrol students into certain courses.
                  </ListItem>
                  <ListItem href="/pano" title="Virtual Tour">
                    Get placed into a random location in the school and explore.
                  </ListItem>
                  <ListItem href="/add-student" title="Add Student">
                    Add a student to then enrol to courses.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="" alt="User Avatar" />
                      <AvatarFallback>
                        {userEmail?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[2147483647]">
                    <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => router.push("/admin")}>
                          <ShieldIcon className="mr-2 h-4 w-4" />
                          <span>Admin Page</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem onClick={() => router.push("/reset-password")}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Reset Password</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" legacyBehavior passHref>
                  <NavigationMenuLink className={"bg-transparent"}>
                    <span className="font-medium">Login</span>
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </motion.div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export { Navbar }