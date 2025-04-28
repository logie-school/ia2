"use client"

import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
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
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "English",
      url: "#",
      items: [
        {
          title: "English General",
          url: "#",
        },
        {
          title: "English Extension",
          url: "#",
        },
        {
          title: "Literature",
          url: "#",
        },
      ],
    },
    {
      title: "Mathematics",
      url: "#",
      items: [
        {
          title: "Essential Mathematics",
          url: "#",
        },
        {
          title: "Mathematics General",
          url: "#",
        },
        {
          title: "Mathematics Methods",
          url: "#",
        },
        {
          title: "Specialists Mathematics",
          url: "#",
        },
      ],
    },
    {
      title: "Science",
      url: "#",
      items: [
        {
          title: "Biology",
          url: "#",
        },
        {
          title: "Chemistry",
          url: "#",
        },
        {
          title: "Physics",
          url: "#",
        },
      ],
    },
    {
      title: "Humanities",
      url: "#",
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Geography",
          url: "#",
        },
        {
          title: "Legal Studies",
          url: "#",
        },
        {
          title: "Psychology",
          url: "#",
        },
        {
          title: "Philosophy",
          url: "#",
        },
      ],
    },
    {
      title: "Languages",
      url: "#",
      items: [
        {
          title: "Italian",
          url: "#",
        },
      ],
    },
    {
      title: "Arts",
      url: "#",
      items: [
        {
          title: "Visual Arts",
          url: "#",
        },
        {
          title: "Drama",
          url: "#",
        },
        {
          title: "Music",
          url: "#",
        },
      ],
    },
    {
      title: "Technology",
      url: "#",
      items: [
        {
          title: "Design and Technology",
          url: "#",
        },
        {
          title: "Digital Solutions",
          url: "#",
        },
        {
          title: "Engineering General",
          url: "#",
        },
        {
          title: "Certificate in Engineering",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredData, setFilteredData] = React.useState(data.navMain)

  React.useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    const filtered = data.navMain
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.title.toLowerCase().includes(lowercasedSearchTerm)
        ),
      }))
      .filter((group) => group.items.length > 0)
    setFilteredData(filtered)
  }, [searchTerm])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </SidebarHeader>
      <SidebarContent>
        {filteredData.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="font-bold opacity-50 uppercase">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}