"use client";

import { Navbar } from "@/components/nav-bar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function AdminPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const router = useRouter();

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

  if (hasPermission === null) {
    return <Loader/>; // Show a loading state while checking permissions
  }

  if (!hasPermission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
        <Navbar bgColor="#fff" />
        <div className="flex w-full max-w-sm flex-col gap-6 pt-[89px]">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Navbar bgColor="#fff" />
      <div className="flex w-full max-w-sm flex-col gap-6 pt-[89px]">
        <h1 className="text-2xl font-bold">Admin Page</h1>
        <p>Welcome to the admin page!</p>
      </div>
    </div>
  );
}