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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { IdCard, Send, MoreHorizontal } from "lucide-react";

export type User = {
  user_id: string;
  user_email: string;
  created: string;
  fn: string;
  mn?: string;
  sn: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
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
              onClick={() => navigator.clipboard.writeText(user.user_id)}
            >
              <IdCard className="mr-2 h-4 w-4" />
              Copy User ID
            </DropdownMenuItem>
            <a
              href={`mailto:${user.user_email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function UsersPage() {
  const [data, setData] = React.useState<User[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    user_id: false, // Hide the User ID column by default
    mn: false, // Hide the Middle Name column by default
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchType, setSearchType] = React.useState<string>("user_email");
  const [searchValue, setSearchValue] = React.useState<string>("");

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    table.setColumnFilters([{ id: searchType, value }]);
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

            {/* Search Type Dropdown */}
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

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Change Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.header as string}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
            value={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
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