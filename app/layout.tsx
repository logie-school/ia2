"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwt.decode(token) as { email?: string } | null;

        // Check if the decoded token has the required structure
        if (!decoded || !decoded.email) {
          console.warn("Invalid token structure.");
          toast.error("Invalid or tampered token. Please log in again.");
          localStorage.removeItem("token");
          return;
        }

        // If valid, show a success toast
        console.log(`Welcome back, ${decoded.email}!`);
      } catch (error) {
        // Catch any decoding errors
        console.warn("Token decoding error:", error);
        toast.error("Invalid or tampered token. Please log in again.");
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased vsc-initialized">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="bottom-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}