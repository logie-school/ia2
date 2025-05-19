"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/nav-bar";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PotentialStudent = {
  id: string;
  email: string;
  fn: string;
  mn?: string;
  sn: string;
  created: string;
};

type Enrolment = {
  course_id: string;
  course_name: string;
  enrolled_at: string;
};

const FormSchema = z.object({
  email: z.string().email(),
  fn: z.string().min(1),
  mn: z.string().optional(),
  sn: z.string().min(1),
  dob: z.date({ required_error: "A date of birth is required." }),
  year_level: z
    .number({ required_error: "Year level is required." })
    .min(7, "Year level must be between 7 and 12")
    .max(12, "Year level must be between 7 and 12"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function StudentsPage() {
  const [students, setStudents] = useState<PotentialStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Enrolments dialog state
  const [enrolDialogOpen, setEnrolDialogOpen] = useState<string | null>(null);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [enrolmentsLoading, setEnrolmentsLoading] = useState(false);
  const [removeDialog, setRemoveDialog] = useState<{ studentId: string; courseId: string } | null>(null);
  const [removing, setRemoving] = useState(false);

  // Fetch students for this user
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("/api/potential-students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setStudents(await res.json());
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      fn: "",
      mn: "",
      sn: "",
      dob: undefined,
      year_level: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/potential-students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          dob: data.dob.toISOString(),
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Student added!");
        form.reset({
          email: "",
          fn: "",
          mn: "",
          sn: "",
          dob: undefined,
          year_level: undefined,
        });
        fetchStudents();
      } else {
        toast.error(result.message || "Failed to add student.");
      }
    } catch {
      toast.error("Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/potential-students", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Student deleted!");
        fetchStudents();
      } else {
        toast.error(result.message || "Failed to delete student.");
      }
    } catch {
      toast.error("Failed to delete student.");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(null);
    }
  };

  // Fetch enrolments for a student
  const handleSeeEnrolments = async (studentId: string) => {
    setEnrolDialogOpen(studentId);
    setEnrolmentsLoading(true);
    setEnrolments([]);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`/api/enrolments?student_id=${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEnrolments(await res.json());
      } else {
        setEnrolments([]);
      }
    } catch {
      setEnrolments([]);
    } finally {
      setEnrolmentsLoading(false);
    }
  };

  const handleRemoveEnrolment = async (studentId: string, courseId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/enrolments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Enrolment removed.");
        // Refresh enrolments
        handleSeeEnrolments(studentId);
      } else {
        toast.error(result.message || "Failed to remove enrolment.");
      }
    } catch {
      toast.error("Failed to remove enrolment.");
    }
  };

  return (
    <div className="enrol-wrapper flex flex-col min-h-screen bg-background">
      <Navbar bgColor="#fff" />
      <div className="flex flex-1 flex-col md:flex-row min-h-0 h-[calc(100vh-89px)] p-8 mt-[89px] gap-8">
        {/* Left: Add Student Form */}
        <div className="min-w-[400px] w-full md:w-auto flex-shrink-0 flex flex-col items-center justify-start bg-white h-full">
          <Card className="w-full md:max-w-[400px]">
            <CardHeader>
              <CardTitle>Add a new student</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="student@email.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Middle Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Surname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of birth</FormLabel>
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date of birth"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => {
                                field.onChange(date ? date.toDate() : null);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!form.formState.errors.dob,
                                  helperText: form.formState.errors.dob?.message,
                                  InputProps: {
                                    sx: {
                                      borderRadius: '0.5rem', // match Input
                                      backgroundColor: '#fff',
                                      fontFamily: 'inherit',
                                      fontSize: '1rem',
                                      color: '#222',
                                      boxSizing: 'border-box',
                                      padding: '0 14px',
                                    },
                                  },
                                  sx: {
                                    width: '100%',
                                    margin: 0,
                                    padding: 0,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '0.5rem',
                                      backgroundColor: '#fff',
                                      fontFamily: 'inherit',
                                      fontSize: '1rem',
                                      color: '#222',
                                      height: '44px',
                                      boxShadow: 'none',
                                      padding: 0,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#e5e7eb',
                                    },
                                    '& .MuiInputBase-input': {
                                      padding: 0,
                                      paddingLeft: '14px',
                                      fontFamily: 'inherit',
                                      fontSize: '1rem',
                                      color: '#222',
                                      height: '44px',
                                      display: 'flex',
                                      alignItems: 'center',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                      color: '#a3a3a3',
                                      opacity: 1,
                                      fontFamily: 'inherit',
                                      fontSize: '1rem',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#a3a3a3',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#000',
                                    },
                                  },
                                  inputProps: {
                                    style: {
                                      fontFamily: 'inherit',
                                      fontSize: '1rem',
                                      color: '#222',
                                      height: '44px',
                                      padding: 0,
                                      paddingLeft: '14px',
                                      boxSizing: 'border-box',
                                    },
                                  },
                                },
                                popper: {
                                  sx: {
                                    '& .MuiPaper-root': {
                                      borderRadius: '0.5rem',
                                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                      fontFamily: 'inherit',
                                    },
                                  },
                                },
                              }}
                              disableFuture
                              minDate={dayjs("1900-01-01")}
                            />
                          </LocalizationProvider>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Level</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={7}
                            max={12}
                            placeholder="Year Level (7-12)"
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Student"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        {/* Right: Student List */}
        <div className="flex-1 min-w-0 h-full overflow-auto">
          <h2 className="text-xl font-semibold mb-2">Added Students</h2>
          <div className="space-y-2">
            {students.length === 0 ? (
              <div className="text-muted-foreground">No students added yet.</div>
            ) : (
              <ul className="space-y-2">
                {students.map((student) => (
                  <li key={student.id} className="border rounded p-3 flex flex-row items-center justify-between bg-card">
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center gap-2">
                        <div className="font-bold">{student.fn} {student.sn}</div>
                        <div className="flex flex-row gap-2">
                          <Badge>
                            Year: {student.year_level}
                          </Badge>
                          <Badge>
                            DOB: {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Added: {new Date(student.created).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSeeEnrolments(student.id)}
                      >
                        Manage Enrolments
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 hover:bg-red-500 hover:text-white"
                        onClick={() => setDeleteDialogOpen(student.id)}
                        aria-label="Delete student"
                      >
                        <X />
                      </Button>
                    </div>
                    {/* Delete Dialog */}
                    <Dialog
                      open={deleteDialogOpen === student.id}
                      onOpenChange={(open) => setDeleteDialogOpen(open ? student.id : null)}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Student</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete <b>{student.fn} {student.sn}</b>? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(student.id)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : `Delete ${student.fn}`}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {/* See Enrolments Dialog */}
                    <Dialog
                      open={enrolDialogOpen === student.id}
                      onOpenChange={(open) => setEnrolDialogOpen(open ? student.id : null)}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Enrolments for {student.fn} {student.sn}</DialogTitle>
                        </DialogHeader>
                        {enrolmentsLoading ? (
                          <div>Loading enrolments...</div>
                        ) : enrolments.length === 0 ? (
                          <div className="text-muted-foreground">No enrolments found.</div>
                        ) : (
                          <ul className="space-y-2">
                            {enrolments.map((e) => (
                              <li key={e.course_id} className="border rounded px-3 py-2 bg-muted flex items-center justify-between gap-2">
                                <div>
                                  <div className="font-semibold">{e.course_name}</div>
                                  <div className="text-xs opacity-60">Enrolled: {new Date(e.enrolled_at).toLocaleString()}</div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setRemoveDialog({ studentId: enrolDialogOpen!, courseId: e.course_id })}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEnrolDialogOpen(null)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {/* Remove Enrolment Dialog */}
                    <Dialog
                      open={!!removeDialog}
                      onOpenChange={(open) => !open && setRemoveDialog(null)}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Remove Enrolment</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove this enrolment? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setRemoveDialog(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={removing}
                            onClick={async () => {
                              if (!removeDialog) return;
                              setRemoving(true);
                              await handleRemoveEnrolment(removeDialog.studentId, removeDialog.courseId);
                              setRemoving(false);
                              setRemoveDialog(null);
                            }}
                          >
                            {removing ? "Removing..." : "Remove"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}