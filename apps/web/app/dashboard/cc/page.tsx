"use client";

import { useState, Suspense, useEffect } from "react";
import { ShieldCheck, Search } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { UserTable } from "../components/admin/user-table";
import { DoctorTable } from "../components/admin/doctor-table";

export default function AdminControlCenterPage() {
  return (
    <Suspense fallback={null}>
      <AdminControlCenter />
    </Suspense>
  );
}

function AdminControlCenter() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAdmin, _setIsAdmin] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <ShieldCheck className="mb-4 h-16 w-16 text-destructive/50" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground max-w-xs">
          You do not have the required permissions to access the Admin Control
          Center.
        </p>
        <Button variant="outline" className="mt-6 bg-transparent">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Platform Management
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                administration tools.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab}...`}
                className="pl-10 h-10 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b pb-1">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger
                  value="users"
                  className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="doctors"
                  className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Doctors
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="users" className="mt-0 outline-none">
              <UserTable searchTerm={debouncedSearch} />
            </TabsContent>
            <TabsContent value="doctors" className="mt-0 outline-none">
              <DoctorTable searchTerm={debouncedSearch} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
