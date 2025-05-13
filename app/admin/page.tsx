"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import { BanIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { motion } from "framer-motion";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

// Import the components for each page
import CoursesPage from "./components/courses";
import SubjectsPage from "./components/subjects";
import UsersPage from "./components/users";

export default function AdminPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<string | null>(""); // Track the current page
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkPermissions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setHasPermission(false);
        return;
      }

      try {
        const response = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.role_id <= 3) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setHasPermission(false);
      }
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    // Update the current page whenever the query parameter changes
    const page = searchParams.get("page");
    setCurrentPage(page);
  }, [searchParams]);

  if (hasPermission === null) {
    return <Loader />; // Show a loading state while checking permissions
  }

  if (!hasPermission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted pt-[89px]">
        <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl bg-red-400/20 p-6 border border-red-400 shadow-md">
          <BanIcon className="size-8 text-red-700" />
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
            <p className="text-red-700">You do not have permission to view this page.</p>
          </div>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onClick={() => {
              router.push("/");
            }}
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Render content based on the current page
  const renderContent = () => {
    switch (currentPage) {
      case "users":
        return <UsersPage />;
      case "courses":
        return <CoursesPage />;
      case "subjects":
        return <SubjectsPage />;
      default:
        return <div>
          <h1 className="text-2xl font-bold">Welcome to the Admin Page</h1>
          <p className="text-muted-foreground">Select a page from the sidebar to get started.</p>
        </div>;
    }
  };

  return (
    <div className="flex mt-[89px]">

      <motion.div
        initial={{ opacity: 0, pointerEvents: "none" }}
        animate={{ opacity: 1, pointerEvents: "all" }}
        transition={{ duration: 1, ease: [0.7, 0, 0.24, 0.99], delay: 0.5 }}
        className="w-full h-full"
      >
        <SidebarProvider>
          <AppSidebar activePage={currentPage} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {renderContent()}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </motion.div>
    </div>
  );
}