"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
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
import { Card, CardContent } from "@workspace/ui/components/card";
import { EditDoctorModal } from "./edit-doctor-modal";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  experience: number;
  place: string;
  image?: string;
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Smith",
    specialization: "Cardiology",
    phone: "+1 (555) 123-4567",
    email: "sarah.smith@med.com",
    experience: 12,
    place: "Heart & Vascular Center",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    phone: "+1 (555) 987-6543",
    email: "m.chen@hospital.org",
    experience: 8,
    place: "Neuroscience Institute",
  },
  {
    id: "3",
    name: "Dr. Emily Blunt",
    specialization: "Pediatrics",
    phone: "+1 (555) 456-7890",
    email: "emily.b@clinic.net",
    experience: 15,
    place: "Children's Health Clinic",
  },
];

interface DoctorTableProps {
  searchTerm?: string;
}

export function DoctorTable({ searchTerm = "" }: DoctorTableProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const handleSave = (updatedDoctor: Doctor) => {
    setDoctors(
      doctors.map((d) => (d.id === updatedDoctor.id ? updatedDoctor : d)),
    );
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(search) ||
      doctor.email.toLowerCase().includes(search) ||
      doctor.specialization.toLowerCase().includes(search) ||
      doctor.place.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Doctor Management
        </h2>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={doctor.image || "/placeholder.svg"} />
                    <AvatarFallback>{doctor.name.charAt(4)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{doctor.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {doctor.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{doctor.specialization}</Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {doctor.experience} Years
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {doctor.place}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DoctorActions
                    doctor={doctor}
                    onEdit={() => setEditingDoctor(doctor)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={doctor.image || "/placeholder.svg"} />
                    <AvatarFallback>{doctor.name.charAt(4)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{doctor.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {doctor.email}
                    </span>
                  </div>
                </div>
                <DoctorActions
                  doctor={doctor}
                  onEdit={() => setEditingDoctor(doctor)}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{doctor.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.place}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditDoctorModal
        doctor={editingDoctor}
        isOpen={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        onSave={handleSave}
      />
    </div>
  );
}

function DoctorActions({
  doctor,
  onEdit,
}: {
  doctor: Doctor;
  onEdit: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Doctor Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" onClick={onEdit}>
          <Pencil className="h-4 w-4" /> Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Mail className="h-4 w-4" /> Contact Doctor
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive gap-2 focus:text-destructive">
          <Trash2 className="h-4 w-4" /> Delete Doctor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
