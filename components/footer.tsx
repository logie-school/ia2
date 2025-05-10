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
        <footer className="w-full p-16 flex gap-6 flex-col max-[1300px]:flex-wrap" suppressHydrationWarning>
          <div className="w-full p-16 flex gap-6 flex-row max-[1300px]:flex-wrap">
            <motion.div className="footer-column flex flex-col w-full min-w[200px] bg-transparent rounded-xl p-2 items-center justify-center" initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }} whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.5, delay: 0 }}>
              <svg width="64" height="64" viewBox="0 0 186 186" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50.1117 92.9879C26.5493 133.782 7.25909 167.198 7.25909 167.245C7.25909 167.281 12.9236 167.317 19.8495 167.317H32.428L62.7378 114.92C79.398 86.1096 93.0832 62.5352 93.1427 62.5352C93.2141 62.5352 124.357 116.324 124.357 116.455C124.357 116.479 119.763 116.503 114.158 116.503H103.948L97.6886 127.368L91.4172 138.221L114.218 138.28L137.007 138.34L145.373 152.798L153.727 167.257L166.305 167.293C173.588 167.305 178.86 167.269 178.836 167.21C178.717 166.9 93.107 18.802 93.0475 18.802C92.9999 18.802 73.6859 52.1821 50.1117 92.9879Z" fill="white"/>
                <path d="M67.0695 122.155C52.7536 146.944 41.0557 167.245 41.0914 167.269C41.1152 167.293 64.5585 167.305 93.1904 167.293L145.254 167.257L138.994 156.428L132.735 145.599L105.757 145.563C90.9174 145.551 78.7793 145.516 78.7793 145.492C78.7793 145.48 79.7551 143.778 80.9332 141.719C104.067 101.687 105.686 98.843 105.578 98.605C105.4 98.2242 93.2975 77.3036 93.1904 77.1965C93.1428 77.1489 81.3854 97.3793 67.0695 122.155Z" fill="white"/>
              </svg>
          </motion.div>
          <div className="footer-column flex flex-col w-full min-w[200px]">
            <strong className="mb-2 pb-1 border-b-1 border-solid">Main</strong>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0 }}>
              <FooterItem name='Courses' href='#'></FooterItem>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <FooterItem name='Enrol' href='#'></FooterItem>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <FooterItem name='Site Map' href='#'></FooterItem>
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