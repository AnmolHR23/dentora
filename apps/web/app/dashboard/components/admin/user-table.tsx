"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  UserCog,
  Trash2,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Card, CardContent } from "@workspace/ui/components/card";

// Mock Data Types based on Prisma
type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: string;
  image?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "PATIENT",
    emailVerified: new Date(),
    createdAt: "2023-10-01",
  },
  {
    id: "2",
    name: "Dr. Sarah Smith",
    email: "sarah.smith@med.com",
    role: "DOCTOR",
    emailVerified: new Date(),
    createdAt: "2023-09-15",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@medplatform.com",
    role: "ADMIN",
    emailVerified: new Date(),
    createdAt: "2023-01-10",
  },
  {
    id: "4",
    name: "Jane Wilson",
    email: "jane.w@outlook.com",
    role: "PATIENT",
    emailVerified: null,
    createdAt: "2023-11-20",
  },
];

interface UserTableProps {
  searchTerm?: string;
}

export function UserTable({ searchTerm = "" }: UserTableProps) {
  const [users, _setUsers] = useState<User[]>(mockUsers);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    // UI Only implementation
    console.log("[v0] Deleting user:", id);
    setDeleteId(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          User Management
        </h2>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "destructive"
                        : user.role === "DOCTOR"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.emailVerified ? (
                    <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" /> Pending
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <UserActions
                    user={user}
                    onDelete={() => setDeleteId(user.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {user.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <UserActions
                  user={user}
                  onDelete={() => setDeleteId(user.id)}
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge
                  variant={
                    user.role === "ADMIN"
                      ? "destructive"
                      : user.role === "DOCTOR"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {user.role}
                </Badge>
                {user.emailVerified && (
                  <Badge
                    variant="outline"
                    className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  >
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UserActions({ user, onDelete }: { user: User; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "PATIENT" && (
          <DropdownMenuItem className="gap-2">
            <UserCheck className="h-4 w-4" /> Convert to Doctor
          </DropdownMenuItem>
        )}
        {user.role === "DOCTOR" && (
          <DropdownMenuItem className="gap-2">
            <UserCog className="h-4 w-4" /> Revert to Patient
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="gap-2">
          <ShieldCheck className="h-4 w-4" /> Change to Admin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive gap-2 focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
