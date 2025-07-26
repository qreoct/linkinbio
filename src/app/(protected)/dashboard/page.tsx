"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import LinkInBioPage from "@/components/linkinbio/Page";
import PageBuilder from "@/components/linkinbio/PageBuilder";
import Iphone15Pro from "@/components/magicui/iphone-15-pro";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LinkInBioPageConfig } from "@/types/linkinbio";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [config, setConfig] = useState<LinkInBioPageConfig>({
    profile: {
      name: session?.user?.name || "John Doe",
      avatar: session?.user?.image || "https://via.placeholder.com/150",
      bio: "Welcome to my page!",
    },
    components: [
      {
        id: crypto.randomUUID(),
        type: "link",
        order: 0,
        title: "Link 1", 
        url: "https://www.google.com",
      },
    ],
  });
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build My Page
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
                <PageBuilder
                  config={config}
                  onConfigChange={(newConfig) => {
                    setConfig(newConfig);
                  }}
                />
            </div>
            <div className="aspect-video">
              <Iphone15Pro componentSrc={<LinkInBioPage config={config} />} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
