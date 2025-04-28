"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Burger } from "@/components/burger"
import './nav-bar.css'
import { motion } from "framer-motion"

function Navbar() {
  return (
    <motion.div className="z-[999] w-full mx-auto border-b-1 shadow-xl p-3 justify-center flex-row flex items-center fixed top-0 bg-background/50 backdrop-blur-sm nav" suppressHydrationWarning initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [.7,0,.24,.99], delay: 0 }}>
      <div className="w-[60%] flex items-center justify-between nav-bar">
        <a className="nav-logo font-bold text-xl flex flex-row items-center gap-4" href="/">
          <img src="/sbshs.webp" alt="logo" className="nav-img aspect-square h-[64px]" style={{ filter: "drop-shadow(0 0 10px #0005)" }} />
          <span className="text-2xl font-bold text-primary nav-title">Sunshine Beach State High School</span>
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
              <NavigationMenuTrigger className="bg-transparent">Links</NavigationMenuTrigger>
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
                  <ListItem href="/enroll" title="Course Enrollment">
                    Enroll students into certain courses.
                  </ListItem>
                  <ListItem href="/" title="Virtual Tour">
                    Get placed into a random location in the school and explore.
                  </ListItem>
                  <ListItem href="/courses" title="Courses">
                    Get information on the courses at the school.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink className={"bg-transparent"}>
                <span className="font-medium">Login</span>
                </NavigationMenuLink>
              </Link>
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