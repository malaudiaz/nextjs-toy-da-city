import type { Metadata } from "next";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/ConfigSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";

// ✅ Agrega esta función:
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("configurations"); // o el namespace que uses
  return {
    title: t("title"), // esto será "Configuraciones" en español, etc.
  };
}

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