import type { Metadata } from "next";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/ConfigSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Configurations",
};

export default function ConfigLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar/> 
      {/* Contenedor principal */}
      <SidebarInset className="flex flex-col">
        {/* Contenido dinámico */}
        <main className="flex-1 w-full  min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}