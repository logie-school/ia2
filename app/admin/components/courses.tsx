"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Eye, EyeOff, Plus, Trash2, IdCard, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

export type Course = {
  course_id: string;
  course_name: string;
  course_desc: string;
  host_user_id: string;
  host_user_name?: string;
  year_level: number;
  subject_id?: string;
  subject_name?: string;
  offering_date?: string;
  location?: string;
  cost?: number;
  prereq?: string;
};

const COURSE_COLUMNS = [
  { key: "course_id", label: "Course ID" },
  { key: "course_name", label: "Name" },
  { key: "course_desc", label: "Description" },
  { key: "host_user_name", label: "Host Teacher" },
  { key: "year_level", label: "Year" },
  { key: "subject_name", label: "Subject" },
  { key: "offering_date", label: "Offering" },
  { key: "location", label: "Location" },
  { key: "cost", label: "Cost" },
  { key: "prereq", label: "Prerequisites" },
  { key: "actions", label: "Actions" },
];

// Map searchType values to user-friendly labels
const SEARCH_TYPE_LABELS: Record<string, string> = {
  course_name: "Course Name",
  host_user_name: "Host Teacher",
  subject_name: "Subject",
  year_level: "Year",
  location: "Location",
};

export default function CoursesPage() {
  const [data, setData] = React.useState<Course[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [searchType, setSearchType] = React.useState<string>("course_name");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    course_id: "",
    course_name: "",
    course_desc: "",
    host_user_id: "",
    year_level: "",
    subject_id: "",
    offering_date: "",
    location: "",
    cost: "",
    prereq: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [teacherOptions, setTeacherOptions] = React.useState<{ user_id: string; name: string }[]>([]);
  const [subjectOptions, setSubjectOptions] = React.useState<{ subject_id: string; name: string }[]>([]);
  const [courseIdError, setCourseIdError] = React.useState<string | null>(null);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    course_id: true,
    course_name: true,
    course_desc: false,
    host_user_name: true,
    year_level: true,
    subject_name: true,
    offering_date: true,
    location: true,
    cost: true,
    prereq: false,
    actions: true,
  });

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<string | null>(null);

  // Fetch courses, teachers, and subjects
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/courses");
      const result = await res.json();
      setData(result);

      // Fetch teachers (role_id = 4)
      const teacherRes = await fetch("/api/users?role_id=4");
      const teachers = await teacherRes.json();
      setTeacherOptions(
        teachers.map((u: any) => ({
          user_id: u.user_id,
          name: `${u.fn} ${u.sn}`,
        }))
      );

      // Fetch subjects
      const subjectRes = await fetch("/api/subjects");
      const subjects = await subjectRes.json();
      setSubjectOptions(
        subjects.map((s: any) => ({
          subject_id: s.subject_id,
          name: s.name,
        }))
      );
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "course_id") setCourseIdError(null);
  };

  // Check course_id uniqueness
  const checkCourseIdUnique = (id: string) => {
    return !data.some((course) => course.course_id === id);
  };

  // Handle course creation
  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.course_id) {
        setCourseIdError("Course ID is required.");
        setLoading(false);
        return;
      }
      if (!checkCourseIdUnique(form.course_id)) {
        setCourseIdError("Course ID must be unique.");
        setLoading(false);
        return;
      }
      if (!form.course_name || !form.course_desc || !form.host_user_id || !form.year_level) {
        toast.error("Please fill all required fields.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No admin token found.");

      const res = await fetch("/api/create-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create course.");

      toast.success("Course created successfully!");
      setOpen(false);
      setForm({
        course_id: "",
        course_name: "",
        course_desc: "",
        host_user_id: "",
        year_level: "",
        subject_id: "",
        offering_date: "",
        location: "",
        cost: "",
        prereq: "",
      });
      setCourseIdError(null);
      // Refresh course list
      const response = await fetch("/api/courses");
      setData(await response.json());
    } catch (err: any) {
      toast.error(err.message || "Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const filteredData = data.filter((course) => {
    if (!searchValue) return true;
    if (searchType === "host_user_name") {
      return (course.host_user_name || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    }
    if (searchType === "subject_name") {
      return (course.subject_name || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    }
    return (
      (course[searchType as keyof Course] || "")
        .toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  });

  // Column visibility dropdown
  const handleToggleColumn = (key: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder={`Search ${SEARCH_TYPE_LABELS[searchType] || searchType}`}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="max-w-sm"
          />
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger>
              <SelectValue>
                {SEARCH_TYPE_LABELS[searchType] || searchType}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="course_name">Course Name</SelectItem>
              <SelectItem value="host_user_name">Host Teacher</SelectItem>
              <SelectItem value="subject_name">Subject</SelectItem>
              <SelectItem value="year_level">Year</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
          
        </div>

        <div className="flex items-center gap-4">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Visible Columns
                <Eye />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {COURSE_COLUMNS.filter(col => col.key !== "actions").map((col) => (
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

          <Button onClick={() => setOpen(true)} variant="outline">
            New Course
            <Plus />
          </Button>

        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <form onSubmit={handleDialogSubmit} className="p-2 flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Add Course</DialogTitle>
              </DialogHeader>
              <Input
                name="course_id"
                placeholder="Course ID"
                value={form.course_id}
                onChange={handleInputChange}
                required
                aria-invalid={!!courseIdError}
                autoComplete="off"
              />
              {courseIdError && (
                <span className="text-red-500 text-xs">{courseIdError}</span>
              )}
              <Input
                name="course_name"
                placeholder="Course Name"
                value={form.course_name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="course_desc"
                placeholder="Description"
                value={form.course_desc}
                onChange={handleInputChange}
                required
              />
              <Select
                value={form.host_user_id}
                onValueChange={(v) => setForm((f) => ({ ...f, host_user_id: v }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Host Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teacherOptions.map((t) => (
                    <SelectItem key={t.user_id} value={t.user_id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="year_level"
                placeholder="Year Level"
                value={form.year_level}
                onChange={handleInputChange}
                required
                type="number"
                min={7}
                max={12}
              />
              <Select
                value={form.subject_id || "none"}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, subject_id: v === "none" ? "" : v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Subject (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subjectOptions.map((s) => (
                    <SelectItem key={s.subject_id} value={s.subject_id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="offering_date"
                placeholder="Offering Date (e.g. Term 2)"
                value={form.offering_date}
                onChange={handleInputChange}
              />
              <Input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleInputChange}
              />
              <Input
                name="cost"
                placeholder="Cost"
                value={form.cost}
                onChange={handleInputChange}
                type="number"
                min={0}
              />
              <Input
                name="prereq"
                placeholder="Prerequisites"
                value={form.prereq}
                onChange={handleInputChange}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.course_id && <TableCell>Course ID</TableCell>}
              {columnVisibility.course_name && <TableCell>Name</TableCell>}
              {columnVisibility.course_desc && <TableCell>Description</TableCell>}
              {columnVisibility.host_user_name && <TableCell>Host Teacher</TableCell>}
              {columnVisibility.year_level && <TableCell>Year</TableCell>}
              {columnVisibility.subject_name && <TableCell>Subject</TableCell>}
              {columnVisibility.offering_date && <TableCell>Offering</TableCell>}
              {columnVisibility.location && <TableCell>Location</TableCell>}
              {columnVisibility.cost && <TableCell>Cost</TableCell>}
              {columnVisibility.prereq && <TableCell>Prerequisites</TableCell>}
              {columnVisibility.actions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((course) => (
              <TableRow key={course.course_id}>
                {columnVisibility.course_id && (
                  <TableCell>{course.course_id}</TableCell>
                )}
                {columnVisibility.course_name && (
                  <TableCell>{course.course_name}</TableCell>
                )}
                {columnVisibility.course_desc && (
                  <TableCell>{course.course_desc}</TableCell>
                )}
                {columnVisibility.host_user_name && (
                  <TableCell>{course.host_user_name}</TableCell>
                )}
                {columnVisibility.year_level && (
                  <TableCell>{course.year_level}</TableCell>
                )}
                {columnVisibility.subject_name && (
                  <TableCell>{course.subject_name}</TableCell>
                )}
                {columnVisibility.offering_date && (
                  <TableCell>{course.offering_date || "N/A"}</TableCell>
                )}
                {columnVisibility.location && (
                  <TableCell>{course.location || "N/A"}</TableCell>
                )}
                {columnVisibility.cost && (
                  <TableCell>
                    {course.cost !== undefined && course.cost !== null
                      ? `$${course.cost}`
                      : "N/A"}
                  </TableCell>
                )}
                {columnVisibility.prereq && (
                  <TableCell>{course.prereq || "N/A"}</TableCell>
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
                            navigator.clipboard.writeText(course.course_id);
                            toast.info(`Copied ID of ${course.course_name} to clipboard.`);
                          }}
                        >
                          <IdCard className="mr-2 h-4 w-4" />
                          Copy Course ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="group hover:!bg-red-500/10 hover:!text-red-500"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteDialogOpen(course.course_id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500 transition-colors text-muted-foreground" />
                          Delete Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog
                      open={deleteDialogOpen === course.course_id}
                      onOpenChange={(open) =>
                        setDeleteDialogOpen(open ? course.course_id : null)
                      }
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Course</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete <b>{course.course_name} ({course.course_id})</b>? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                const res = await fetch("/api/delete-course", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    token,
                                    course_id: course.course_id,
                                  }),
                                });
                                const result = await res.json();
                                if (!res.ok) throw new Error(result.message || "Failed to delete course.");
                                toast.success("Course deleted.");
                                setData((prev) =>
                                  prev.filter((c) => c.course_id !== course.course_id)
                                );
                              } catch (err: any) {
                                toast.error(err.message || "Delete failed.");
                              } finally {
                                setDeleteDialogOpen(null);
                              }
                            }}
                          >
                            Delete {course.course_name}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} entries
        </div>
      </div>
    </div>
  );
}