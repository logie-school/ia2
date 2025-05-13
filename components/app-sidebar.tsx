"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activePage?: string | null;
}

export function AppSidebar({ activePage, ...props }: AppSidebarProps) {
  const router = useRouter();

  const navItems = [
    { name: "Subjects", page: "subjects" },
    { name: "Courses", page: "courses" },
    { name: "Users", page: "users" },
  ];

  const handleNavigation = (page: string) => {
    router.push(`?page=${page}`, undefined, { shallow: true }); // Update the query parameter without refreshing
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="gap-2">
        <div className="w-full text-center font-bold pt-2">Admin Page</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold opacity-50 uppercase">
            MAIN
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    isActive={activePage === item.page}
                    onClick={() => handleNavigation(item.page)}
                  >
                    {item.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}