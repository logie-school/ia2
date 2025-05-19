"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/nav-bar";
import { toast } from "sonner";
import { X } from "lucide-react";

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

export default function StudentsPage() {
  const [students, setStudents] = useState<PotentialStudent[]>([]);
  const [form, setForm] = useState({ email: "", fn: "", mn: "", sn: "" });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Student added!");
        setForm({ email: "", fn: "", mn: "", sn: "" });
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="student@email.com"
                  />
                </div>
                <div>
                  <Input
                    id="fn"
                    name="fn"
                    value={form.fn}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <Input
                    id="mn"
                    name="mn"
                    value={form.mn}
                    onChange={handleChange}
                    placeholder="Middle Name"
                  />
                </div>
                <div>
                  <Input
                    id="sn"
                    name="sn"
                    value={form.sn}
                    onChange={handleChange}
                    required
                    placeholder="Surname"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Student"}
                </Button>
              </form>
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
                {students.map((s) => (
                  <li key={s.id} className="border rounded p-3 flex flex-row items-center justify-between bg-card">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate">{s.fn} {s.mn ? s.mn + " " : ""}{s.sn}</span>
                      <span className="text-sm text-muted-foreground truncate">{s.email}</span>
                      <span className="text-xs opacity-60">Added: {new Date(s.created).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSeeEnrolments(s.id)}
                      >
                        Manage Enrolments
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 hover:bg-red-500 hover:text-white"
                        onClick={() => setDeleteDialogOpen(s.id)}
                        aria-label="Delete student"
                      >
                        <X />
                      </Button>
                    </div>
                    {/* Delete Dialog */}
                    <Dialog
                      open={deleteDialogOpen === s.id}
                      onOpenChange={(open) => setDeleteDialogOpen(open ? s.id : null)}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Student</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete <b>{s.fn} {s.sn}</b>? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(s.id)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : `Delete ${s.fn}`}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {/* See Enrolments Dialog */}
                    <Dialog
                      open={enrolDialogOpen === s.id}
                      onOpenChange={(open) => setEnrolDialogOpen(open ? s.id : null)}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Enrolments for {s.fn} {s.sn}</DialogTitle>
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