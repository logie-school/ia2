"use client";

import { Navbar } from "@/components/nav-bar";

export default function EnrolmentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold">Enrolments</h1>
        <p className="text-muted-foreground mt-2">
          Manage all enrolments available for students.
        </p>
        <div className="mt-6 w-full max-w-4xl">
          {/* Add your enrolments management UI here */}
          <div className="bg-muted/50 p-4 rounded-lg shadow-md">
            <p>Enrolments goes here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}