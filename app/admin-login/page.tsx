"use client";

import { AdminLoginForm } from "@/components/admin-login";
import { Navbar } from "@/components/nav-bar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Verify the token with the server
      fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.role_id <= 3) {
            router.push("/admin"); // Redirect to admin page if the user has sufficient permissions
          } else {
            setIsLoading(false); // Stop loading if the user doesn't have permissions
          }
        })
        .catch((err) => {
          console.error("Error verifying token:", err);
          setIsLoading(false); // Stop loading on error
        });
    } else {
      setIsLoading(false); // Stop loading if no token is found
    }
  }, [router]);

  if (isLoading) {
    return <Loader />; // Show the Loader component while loading
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <Navbar />
      <div className="w-full max-w-sm pt-[89px]">
        <AdminLoginForm />
      </div>
    </div>
  );
}