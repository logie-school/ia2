"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/nav-bar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <Navbar bgColor="white" />
        {children}
    </div>
  );
}