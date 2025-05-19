"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Eye, EyeOff, MoreHorizontal, Trash2, IdCard, Send } from "lucide-react";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AdminEnrolment = {
  enrol_id: string;
  course_name: string;
  student_name: string;
  student_email: string;
  guardian_email: string;
  year_level: number;
  dob: string;
  enrolled_at: string;
};

const ENROLMENT_COLUMNS = [
  { key: "course_name", label: "Course" },
  { key: "student_name", label: "Student" },
  { key: "student_email", label: "Student Email" },
  { key: "guardian_email", label: "Guardian Email" },
  { key: "year_level", label: "Year Level" },
  { key: "dob", label: "Date of Birth" },
  { key: "enrolled_at", label: "Enrolled At" },
  { key: "actions", label: "Actions" },
];

export default function EnrolmentsPage() {
  const [enrolments, setEnrolments] = React.useState<AdminEnrolment[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    course_name: true,
    student_name: true,
    student_email: true,
    guardian_email: true,
    year_level: true,
    dob: true,
    enrolled_at: true,
    actions: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<string | null>(null);
  const [selectedEnrolment, setSelectedEnrolment] = React.useState<AdminEnrolment | null>(null);

  React.useEffect(() => {
    const fetchEnrolments = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin-enrolments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEnrolments(await res.json());
      }
      setLoading(false);
    };
    fetchEnrolments();
  }, []);

  const filteredEnrolments = enrolments.filter((enrolment) =>
    Object.values(enrolment).some((value) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const handleToggleColumn = (key: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteEnrolment = async (enrolId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin-enrolments?enrol_id=${enrolId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete enrolment");
      }

      setEnrolments((prev) => prev.filter((e) => e.enrol_id !== enrolId));
      toast.success("Enrolment deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete enrolment");
    } finally {
      setDeleteDialogOpen(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Search enrolments"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Visible Columns
              <Eye />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {ENROLMENT_COLUMNS.filter((col) => col.key !== "actions").map((col) => (
              <DropdownMenuItem
                key={col.key}
                onClick={() => handleToggleColumn(col.key)}
                className="flex items-center gap-2"
              >
                {columnVisibility[col.key] ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                {col.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.course_name && <TableCell>Course</TableCell>}
              {columnVisibility.student_name && <TableCell>Student</TableCell>}
              {columnVisibility.student_email && <TableCell>Student Email</TableCell>}
              {columnVisibility.guardian_email && <TableCell>Guardian Email</TableCell>}
              {columnVisibility.year_level && <TableCell>Year Level</TableCell>}
              {columnVisibility.dob && <TableCell>Date of Birth</TableCell>}
              {columnVisibility.enrolled_at && <TableCell>Enrolled At</TableCell>}
              {columnVisibility.actions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnrolments.map((enrolment) => (
              <TableRow key={enrolment.enrol_id}>
                {columnVisibility.course_name && <TableCell>{enrolment.course_name}</TableCell>}
                {columnVisibility.student_name && <TableCell>{enrolment.student_name}</TableCell>}
                {columnVisibility.student_email && <TableCell>{enrolment.student_email}</TableCell>}
                {columnVisibility.guardian_email && <TableCell>{enrolment.guardian_email}</TableCell>}
                {columnVisibility.year_level && <TableCell>{enrolment.year_level}</TableCell>}
                {columnVisibility.dob && (
                  <TableCell>
                    {enrolment.dob ? new Date(enrolment.dob).toLocaleDateString() : "N/A"}
                  </TableCell>
                )}
                {columnVisibility.enrolled_at && (
                  <TableCell>
                    {enrolment.enrolled_at
                      ? new Date(enrolment.enrolled_at).toLocaleString()
                      : "N/A"}
                  </TableCell>
                )}
                {columnVisibility.actions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(enrolment.enrol_id);
                            toast.info(`Copied enrolment ID to clipboard.`);
                          }}
                        >
                          <IdCard />
                          Copy Enrolment ID
                        </DropdownMenuItem>
                        <a href={`mailto:${enrolment.guardian_email}?subject=${enrolment.course_name} Enrolment for ${enrolment.student_name}`}>
                          <DropdownMenuItem>
                            <Send/>
                            Email Guardian
                          </DropdownMenuItem>
                        </a>
                        <DropdownMenuItem
                          className="group hover:!bg-red-500/10 hover:!text-red-500"
                          onClick={() => {
                            setDeleteDialogOpen(enrolment.enrol_id);
                            setSelectedEnrolment(enrolment);
                          }}
                        >
                          <Trash2 className="group-hover:text-red-500 transition-colors text-muted-foreground" />
                          Delete Enrolment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredEnrolments.length} of {enrolments.length} entries
        </div>
      </div>
      <Dialog 
        open={!!deleteDialogOpen} 
        onOpenChange={() => {
          setDeleteDialogOpen(null);
          setSelectedEnrolment(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enrolment</DialogTitle>
            <DialogDescription>
              Are you sure you want to unenrol <b>{selectedEnrolment?.student_name} from {selectedEnrolment.course_name}</b>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(null);
                setSelectedEnrolment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogOpen && handleDeleteEnrolment(deleteDialogOpen)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}