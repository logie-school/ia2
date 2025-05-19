"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Navbar } from "@/components/nav-bar";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

type PotentialStudent = {
  id: string;
  email: string;
  fn: string;
  mn?: string;
  sn: string;
  created: string;
};

export default function AddStudentPage() {
  const [students, setStudents] = useState<PotentialStudent[]>([]);
  const [form, setForm] = useState({ email: "", fn: "", mn: "", sn: "" });
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
                  <Label htmlFor="email">Student Email</Label>
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
                  <Label htmlFor="fn">First Name</Label>
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
                  <Label htmlFor="mn">Middle Name (optional)</Label>
                  <Input
                    id="mn"
                    name="mn"
                    value={form.mn}
                    onChange={handleChange}
                    placeholder="Middle Name"
                  />
                </div>
                <div>
                  <Label htmlFor="sn">Surname</Label>
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
                  <li key={s.id} className="border rounded hover:bg-muted transition-all hover:pl-6 p-4 flex flex-row items-center justify-between bg-card">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate capitalize">{s.fn} {s.mn ? s.mn + " " : ""}{s.sn}</span>
                      <span className="text-sm text-muted-foreground truncate">{s.email}</span>
                      <span className="text-xs opacity-60">Added: {new Date(s.created).toLocaleString()}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 hover:bg-red-500 hover:text-white"
                      onClick={() => setDeleteDialogOpen(s.id)}
                      aria-label="Delete student"
                    >
                      <X />
                    </Button>
                    <Dialog
                      open={deleteDialogOpen === s.id}
                      onOpenChange={(open) => setDeleteDialogOpen(open ? s.id : null)}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Student</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete <b>{s.fn}</b>? This action cannot be undone.
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