"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { IdCard, Send, MoreHorizontal, PlusIcon, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { reset } from "react-svg-pan-zoom";

export type User = {
  user_id: string;
  user_email: string;
  created: string;
  fn: string;
  mn?: string;
  sn: string;
  role: string;
};

export default function UsersPage() {
  const [data, setData] = React.useState<User[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    user_id: false, // Hide the User ID column by default
    mn: false, // Hide the Middle Name column by default
  });
  const [searchType, setSearchType] = React.useState<string>("user_email");
  const [searchValue, setSearchValue] = React.useState<string>("");

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    fn: "",
    mn: "",
    sn: "",
    role_id: "5",
  });
  const [loading, setLoading] = React.useState(false);

  const USER_COLUMNS = [
    { key: "user_id", label: "User ID" },
    { key: "user_email", label: "Email Address" },
    { key: "fn", label: "First Name" },
    { key: "mn", label: "Middle Name" },
    { key: "sn", label: "Surname" },
    { key: "role", label: "Role" },
    { key: "created", label: "Account Created" },
    { key: "actions", label: "Actions" },
  ];

  React.useEffect(() => {
    setColumnVisibility({
      user_id: false,
      user_email: true,
      fn: true,
      mn: false,
      sn: true,
      role: true,
      created: true,
      actions: true,
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No admin token found.");

      const res = await fetch("/api/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role_id: Number(form.role_id), token }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error("Failed to register user.");

      // Handle insecure password warning from API
      if (result.passwordWarning) {
        toast.warning("User registered, but password is not secure.");
      } else {
        toast.success("User registered successfully!");
      }

      setOpen(false);
      resetForm(); // Reset the form after submitting
      // Optionally, refresh the user list:
      const response = await fetch("/api/users");
      setData(await response.json());
    } catch (err: any) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      fn: "",
      mn: "",
      sn: "",
      role_id: "5",
    });
  };

  const searchTypePlaceholderMap: Record<string, string> = {
    user_id: "Search User ID",
    user_email: "Search Email",
    fn: "Search First Name",
    mn: "Search Middle Name",
    sn: "Search Surname",
    role: "Search Role",
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/users");
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "user_id",
      header: "User ID",
      cell: ({ row }) => <div>{row.getValue("user_id")}</div>,
    },
    {
      accessorKey: "user_email",
      header: "Email Address",
      cell: ({ row }) => <div className="lowercase">{row.getValue("user_email")}</div>,
    },
    {
      accessorKey: "fn",
      header: "First Name",
      cell: ({ row }) => <div>{row.getValue("fn")}</div>,
    },
    {
      accessorKey: "mn",
      header: "Middle Name",
      cell: ({ row }) => <div>{row.getValue("mn") || "N/A"}</div>,
    },
    {
      accessorKey: "sn",
      header: "Surname",
      cell: ({ row }) => <div>{row.getValue("sn")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
    },
    {
      accessorKey: "created",
      header: "Account Created",
      cell: ({ row }) => <div>{new Date(row.getValue("created")).toLocaleDateString()}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(user.user_id);
                  toast.info(`Copied ${user.fn}'s user ID to clipboard.`);
                }}
              >
                <IdCard className="mr-2 h-4 w-4" />
                Copy User ID
              </DropdownMenuItem>
              <a
                href={`mailto:${user.user_email}`}
                rel="noopener noreferrer"
              >
                <DropdownMenuItem>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </DropdownMenuItem>
              </a>
              <DropdownMenuItem
                className="group hover:!bg-red-500/10 hover:!text-red-500"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500 transition-colors text-muted-foreground" />
                Delete User
              </DropdownMenuItem>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete <b>{user.fn}</b>? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          if (!token) throw new Error("No admin token found.");

                          const res = await fetch("/api/delete-user", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ token, user_id: user.user_id }),
                          });
                          const result = await res.json();
                          if (!res.ok) throw new Error(result.message || "Failed to delete user.");

                          toast.success("User deleted successfully!");
                          // Refresh the user list:
                          const response = await fetch("/api/users");
                          setData(await response.json());
                        } catch (err: any) {
                          toast.error(err.message || "Failed to delete user.");
                        } finally {
                          setDeleteDialogOpen(false);
                        }
                      }}
                    >
                      Delete {user.fn}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    table.setColumnFilters([{ id: searchType, value }]);
  };

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
          {/* Search Input */}
          <Input
            placeholder={searchTypePlaceholderMap[searchType] || "Search..."}
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="max-w-sm"
          />

          <Select
            onValueChange={(value) => {
              setSearchType(value);
              setSearchValue(""); // Clear the search input when changing search type
              table.setColumnFilters([]); // Clear filters when changing search type
            }}
            value={searchType}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Search Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user_id">User ID</SelectItem>
              <SelectItem value="user_email">Email</SelectItem>
              <SelectItem value="fn">First Name</SelectItem>
              <SelectItem value="mn">Middle Name</SelectItem>
              <SelectItem value="sn">Surname</SelectItem>
              <SelectItem value="role">Role</SelectItem>
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
              {USER_COLUMNS.filter(col => col.key !== "actions").map((col) => (
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

          <Dialog open={open} onOpenChange={(open) => {
            setOpen(open);
            if (!open) resetForm(); // Reset form when dialog closes
          }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                New User <PlusIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <form onSubmit={handleDialogSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
                  <DialogDescription>
                    Register a new account via the admin panel, allowing you to define more sensitive information such as role.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={form.password}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fn" className="text-right">First Name</Label>
                    <Input
                      id="fn"
                      name="fn"
                      required
                      value={form.fn}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mn" className="text-right">Middle Name</Label>
                    <Input
                      id="mn"
                      name="mn"
                      value={form.mn}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sn" className="text-right">Surname</Label>
                    <Input
                      id="sn"
                      name="sn"
                      required
                      value={form.sn}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role_id" className="text-right">Role</Label>
                    <Select
                      name="role_id"
                      value={form.role_id}
                      onValueChange={(value) => setForm({ ...form, role_id: value })}
                      required
                    >
                      <SelectTrigger className="col-span-3 border rounded px-2 py-1 w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="1">Principal</SelectItem>
                          <SelectItem value="2">Admin</SelectItem>
                          <SelectItem value="3">HOD</SelectItem>
                          <SelectItem value="4">Teacher</SelectItem>
                          <SelectItem value="5">User</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Create Account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and Row Count */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}