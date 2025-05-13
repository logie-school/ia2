"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { IdCard, MoreHorizontal, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export type Subject = {
  subject_id: string;
  name: string;
  faculty?: string;
  hod_user_id: string;
  hod_name?: string;
};

const SUBJECT_COLUMNS = [
  { key: "subject_id", label: "Subject ID" },
  { key: "name", label: "Name" },
  { key: "faculty", label: "Faculty" },
  { key: "HOD", label: "HOD" },
  { key: "actions", label: "Actions" },
];

export default function SubjectsPage() {
  const [data, setData] = React.useState<Subject[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [searchType, setSearchType] = React.useState<string>("name");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    subject_id: "",
    name: "",
    faculty: "",
    hod_user_id: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [hodOptions, setHodOptions] = React.useState<{ user_id: string; name: string }[]>([]);
  const [subjectIdError, setSubjectIdError] = React.useState<string | null>(null);

  // Dialog state for per-row actions
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<string | null>(null);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    subject_id: true,
    name: true,
    faculty: true,
    HOD: true,
    actions: true,
  });

  // Fetch subjects and HOD options
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/subjects");
      const result = await res.json();
      setData(result);

      // Fetch HODs (users with role_id = 3)
      const hodRes = await fetch("/api/users?role_id=3");
      const hods = await hodRes.json();
      setHodOptions(
        hods.map((u: any) => ({
          user_id: u.user_id,
          name: `${u.fn} ${u.sn}`,
        }))
      );
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    if (name === "subject_id") {
      // Only allow up to 3 uppercase letters
      value = value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
      setSubjectIdError(null); // Reset error on change
    }
    setForm({ ...form, [name]: value });
  };

  // Check subject_id uniqueness and length
  const checkSubjectIdUnique = (id: string) => {
    return !data.some((subject) => subject.subject_id === id);
  };

  // Handle subject creation
  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check subject_id requirements before submitting
      if (!form.subject_id) {
        setSubjectIdError("Subject ID is required.");
        setLoading(false);
        return;
      }
      if (form.subject_id.length !== 3) {
        setSubjectIdError("Subject ID must be exactly 3 letters.");
        setLoading(false);
        return;
      }
      if (!checkSubjectIdUnique(form.subject_id)) {
        setSubjectIdError("Subject ID must be unique.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No admin token found.");

      const res = await fetch("/api/create-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create subject.");

      toast.success("Subject created successfully!");
      setOpen(false);
      setForm({ subject_id: "", name: "", faculty: "", hod_user_id: "" });
      setSubjectIdError(null);
      // Refresh subject list
      const response = await fetch("/api/subjects");
      setData(await response.json());
    } catch (err: any) {
      toast.error(err.message || "Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const filteredData = data.filter((subject) => {
    if (searchType === "HOD") {
      // Search by HOD name (case-insensitive)
      return (
        (subject.hod_name || subject.hod_user_id || "")
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    }
    return (
      (subject[searchType as keyof Subject] || "")
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
            placeholder={`Search ${searchType.charAt(0).toUpperCase() + searchType.slice(1)}`}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="max-w-sm"
          />
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger>
              <SelectValue>
                {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="HOD">HOD</SelectItem>
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
              {SUBJECT_COLUMNS.filter(col => col.key !== "actions").map((col) => (
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
            New Subject
            <Plus />
          </Button>

        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <form onSubmit={handleDialogSubmit} className="p-2 flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Add Subject</DialogTitle>
              </DialogHeader>
              <Input
                name="subject_id"
                placeholder="Subject ID (3 letters)"
                value={form.subject_id}
                onChange={handleInputChange}
                required
                aria-invalid={!!subjectIdError}
                maxLength={3}
                autoComplete="off"
              />
              {subjectIdError && (
                <span className="text-red-500 text-xs">{subjectIdError}</span>
              )}
              <Input
                name="name"
                placeholder="Subject Name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="faculty"
                placeholder="Faculty"
                value={form.faculty}
                onChange={handleInputChange}
              />
              <Select
                value={form.hod_user_id}
                onValueChange={(v) => setForm((f) => ({ ...f, hod_user_id: v }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select HOD" />
                </SelectTrigger>
                <SelectContent>
                  {hodOptions.map((hod) => (
                    <SelectItem key={hod.user_id} value={hod.user_id}>
                      {hod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {columnVisibility.subject_id && <TableCell>Subject ID</TableCell>}
              {columnVisibility.name && <TableCell>Name</TableCell>}
              {columnVisibility.faculty && <TableCell>Faculty</TableCell>}
              {columnVisibility.HOD && <TableCell>HOD</TableCell>}
              {columnVisibility.actions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((subject) => (
              <TableRow key={subject.subject_id}>
                {columnVisibility.subject_id && (
                  <TableCell>{subject.subject_id}</TableCell>
                )}
                {columnVisibility.name && (
                  <TableCell>{subject.name}</TableCell>
                )}
                {columnVisibility.faculty && (
                  <TableCell>{subject.faculty || "N/A"}</TableCell>
                )}
                {columnVisibility.HOD && (
                  <TableCell>{subject.hod_name || subject.hod_user_id}</TableCell>
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
                            navigator.clipboard.writeText(subject.subject_id);
                            toast.success(`Copied ${subject.subject_id} to clipboard`);
                          }}
                        >
                          <IdCard />
                          Copy Subject ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="group hover:!bg-red-500/10 hover:!text-red-500"
                          onClick={() => setDeleteDialogOpen(subject.subject_id)}
                        >
                          <Trash2 className="group-hover:text-red-500 transition-colors text-muted-foreground" />
                          Delete Subject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Delete Dialog */}
                    <Dialog open={deleteDialogOpen === subject.subject_id} onOpenChange={() => setDeleteDialogOpen(null)}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Subject</DialogTitle>
                          <DialogDescription className="text-muted-foreground text-sm">
                            Are you sure you want to delete <b>{subject.name} ({subject.subject_id})</b>? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("token");
                                  const res = await fetch("/api/delete-subject", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      token,
                                      subject_id: subject.subject_id,
                                    }),
                                  });
                                  if (!res.ok) throw new Error("Failed to delete subject.");
                                  toast.success("Subject deleted.");
                                  setData((prev) =>
                                    prev.filter((s) => s.subject_id !== subject.subject_id)
                                  );
                                  setDeleteDialogOpen(null);
                                } catch (err: any) {
                                  toast.error(err.message || "Delete failed.");
                                }
                              }}
                            >
                              Delete {subject.name}
                            </Button>
                          </DialogFooter>
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