"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  address: string;
  createdAt: Timestamp;
  dob: string;
  documents: {
    [key: string]: {
      url: string;
      status: string;
    };
  };
  email: string;
  emailVerified: boolean;
  emergencyContact: string;
  fullName: string;
  lastLogin: Timestamp;
  location: {
    latitude: number;
    longitude: number;
  };
  phoneNumber: string;
  profileComplete: boolean;
  profileImageUrl: string;
  userRole: 'admin' | 'customer' | 'car_owner';
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "userRole",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.userRole;
      return <Badge variant={role === 'car_owner' ? "secondary" : "outline"} className="capitalize">{role.replace('_', ' ')}</Badge>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "createdAt",
    header: "Date Registered",
    cell: ({ row }) => {
      const date = row.original.createdAt.toDate();
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "profileComplete",
    header: "Status",
    cell: ({ row }) => {
      const isComplete = row.getValue("profileComplete");
      return isComplete ? <Badge variant="default">Complete</Badge> : <Badge variant="destructive">Incomplete</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as { onUserSelect: (user: User) => void; };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta.onUserSelect(user)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copy User ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];