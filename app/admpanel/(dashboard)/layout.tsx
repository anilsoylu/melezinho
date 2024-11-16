"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { BlockProvider } from "@/context/block-context"
import { AppSidebar } from "./_components/app-sidebar"
import Header from "./_components/header"

const CrmDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BlockProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <main className="flex flex-col w-full p-2">{children}</main>
        </div>
      </SidebarProvider>
    </BlockProvider>
  )
}

export default CrmDashboardLayout
