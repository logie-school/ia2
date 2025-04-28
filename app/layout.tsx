import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider as NextThemesProvider, ThemeProvider } from "next-themes"
// import { Navbar } from "@/components/nav-bar";
import { Toaster } from "@/components/ui/sonner"
// import { Footer } from "@/components/footer";



export const metadata: Metadata = {
  title: "IA2",
  description:
    "Internal Assignment",
  openGraph: {
    title: "IA2",
    description:
      "Internal Assignment",
    url: "https://ia2.logie.lol",
    type: "website",
    images: [
      {
        url: "#",
        alt: "IA2",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased vsc-initialized">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}