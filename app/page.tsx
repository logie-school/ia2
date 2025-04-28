"use client"

import * as React from "react"
import Link from "next/link"
import { delay, easeInOut, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookUser, Clipboard, Sparkle, UserSearch, ArrowRight, LogIn } from "lucide-react";
import './style.css'
import { Navbar } from "@/components/nav-bar"


export default function Home() {
    return (
        <main>
            <Navbar/>
            <div className="flex items-center justify-center h-screen hero load-anim" style={{paddingTop: '61px'}} id="hero">
                <div className="w-[40%] text-left p-10 flex flex-col justify-center gap-4 hero-content">
                <div className="flex justify-center flex-col">
                    <motion.div className="rounded-full flex items-center gap-2 bg-black/5 border border-black/30 w-fit mb-6 select-none" style={{padding: '10px 15px'}} initial={{ opacity: 0, transform: 'translateX(-10px)' }} animate={{ opacity: 1, transform: 'translateX(0px)' }} transition={{ duration: 1, ease: [.7,-0.63,.24,.99], delay: 0.5 }}>
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [.7,0,.24,.99], delay: 1.2 }}>
                        <LogIn />
                    </motion.div>
                    <motion.div style={{transform: 'translateX(-12px)'}} initial={{ transform: 'translateX(-12px)' }} animate={{ transform: 'translateX(0px)' }} transition={{ duration: 1, ease: [.7,0,.24,.99], delay: 1.2 }}>
                        <span>Enrol on the site</span>
                    </motion.div>
                    </motion.div>
                    <h1 className="text-6xl font-bold">Sunshine Beach State High School</h1>
                    <p className="text-lg mt-4 opacity-50 ">
                        Located in the beautiful northern part of Queensland’s Sunshine Coast.
                    </p>
                </div>
                <div className="flex flex-row gap-4 w-full box-border grow-0 overflow-hidden">
                    <Button className="flex-1 min-w-0" asChild>
                    <Link href={'/map'} className="flex items-center justify-between">
                        Explore
                        <ArrowRight />
                    </Link>
                    </Button>
                    {/* <Button className="flex-shrink-0" asChild>
                    <Link className="flex items-center justify-center" href={'https://github.com/logie-school'}>
                        <SiGithub />
                    </Link>
                    </Button> */}
                </div>
                </div>
            </div>
        </main>
    )
}