"use client"

import * as React from "react"
import Link from "next/link"

import { delay, easeInOut, motion } from "framer-motion"
import { FooterItem } from "@/components/footer-item"
import { FooterButton } from "@/components/footer-button" 

export function Footer() {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    async function fetchYear() {
      const fallbackYear = new Date().getFullYear();
      const apiUrl = "http://worldclockapi.com/api/json/utc/now"; // Example API

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        if (data && data.currentDateTime) {
          setCurrentYear(new Date(data.currentDateTime).getFullYear());
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.warn("Using fallback year:", fallbackYear);
        setCurrentYear(fallbackYear);
      }
    }

    fetchYear();
  }, []);
    return (
        <footer className="w-full p-16 flex gap-6 flex-col max-[1300px]:flex-wrap max-[1300px]:p-0 max-[1300px]:pb-4" suppressHydrationWarning>
          <div className="w-full p-16 flex gap-6 flex-row max-[1300px]:flex-wrap max-[1300px]:p-8">
            <motion.div className="footer-column flex flex-col w-full min-w[200px] bg-transparent rounded-xl p-2 items-center justify-center" initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }} whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.5, delay: 0 }}>
              <img src="/sbshs.webp" alt="logo" className="footer-img aspect-square h-[128px] mb-2 select-none" style={{ filter: "drop-shadow(0 0 10px #0005)" }} draggable={false} />
          </motion.div>
          <div className="footer-column flex flex-col w-full min-w[200px]">
            <strong className="mb-2 pb-1 border-b-1 border-solid">Main</strong>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0 }}>
              <FooterItem name='Virtual Tour' href='/pano'></FooterItem>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <FooterItem name='Enrol' href='/enrol'></FooterItem>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <FooterItem name='Site Map' href='/map'></FooterItem>
            </motion.div>
          </div>

          <div className="footer-column flex flex-col w-full min-w[200px]">
            <strong className="mb-2 pb-1 border-b-1 border-solid">Social</strong>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <FooterItem name='YouTube' href='https://www.youtube.com/'></FooterItem>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <FooterItem name='Instagram' href='https://www.instagram.com/'></FooterItem>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <FooterItem name='Facebook' href='https://facebook.com'></FooterItem>
            </motion.div>
          </div>

          <div className="footer-column flex flex-col w-full min-w[200px]">
            <strong className="mb-2 pb-1 border-b-1 border-solid">Contact</strong>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <FooterButton name='Email'></FooterButton>
            </motion.div>
          </div>
          </div>


        <div className="w-full h-[20px] flex flex-row gap-3 items-center justify-center opacity-30 select-none">
            <motion.div initial={{opacity: 0, y: 20}} whileInView={{ opacity: 1, y:0 }} transition={{ duration: 0.7, delay: 0, ease: [.7,0,.24,1.5]}}>© {currentYear}</motion.div>
            <motion.div initial={{opacity: 0, y: 20}} whileInView={{ opacity: 1, y:0 }} transition={{ duration: 0.7, delay: 0.1, ease: [.7,0,.24,1.5] }}>
              <Link href={'https://sunshinebeachhigh.eq.edu.au/'} className="hover:underline">
                SBSHS
              </Link>
            </motion.div>
            <motion.div initial={{opacity: 0, y: 20}} whileInView={{ opacity: 1, y:0 }} transition={{ duration: 0.7, delay: 0.2, ease: [.7,0,.24,1.5] }}> ALL RIGHTS RESERVED</motion.div>
        </div>
      </footer>
      
    )
}