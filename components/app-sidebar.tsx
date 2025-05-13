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
    { name: "Users", page: "users" },
    { name: "Courses", page: "courses" },
    { name: "Course Enrolments", page: "enrolments" },
  ];

  const handleNavigation = (page: string) => {
    router.push(`?page=${page}`, undefined);
  };

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold opacity-50 uppercase">
            Admin Page
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