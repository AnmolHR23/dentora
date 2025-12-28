"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { z } from "@dentora/shared/zod";

const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  place: z.string().min(2, "Clinic location is required"),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

interface EditDoctorModalProps {
  doctor: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDoctor: any) => void;
}

export function EditDoctorModal({
  doctor,
  isOpen,
  onClose,
  onSave,
}: EditDoctorModalProps) {
  const form = useForm<DoctorFormValues>({
    // resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      email: "",
      phone: "",
      experience: 0,
      place: "",
    },
  });

  useEffect(() => {
    if (doctor) {
      form.reset({
        name: doctor.name,
        specialization: doctor.specialization,
        email: doctor.email,
        phone: doctor.phone,
        experience: doctor.experience,
        place: doctor.place,
      });
    }
  }, [doctor, form]);

  const onSubmit = (values: DoctorFormValues) => {
    onSave({ ...doctor, ...values });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Doctor Details</DialogTitle>
          <DialogDescription>
            Update the professional information for {doctor?.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exp (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic / Hospital</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
