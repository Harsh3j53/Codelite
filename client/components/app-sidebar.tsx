"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
  ],
  workspaces: [
    {
      name: "Team Cursor",
    },
    {
      name: "Team Wault",

    },
    {
      name: "Team Apple",
    },
    // {
    //   name: "Home Management",

    //   pages: [
    //     {
    //       name: "Household Budget & Expense Tracking",
    //       url: "#",

    //     },
    //     {
    //       name: "Home Maintenance Schedule & Tasks",
    //       url: "#",

    //     },
    //     {
    //       name: "Family Calendar & Event Planning",
    //       url: "#",

    //     },
    //   ],
    // },
    // {
    //   name: "Travel & Adventure",

    //   pages: [
    //     {
    //       name: "Trip Planning & Itineraries",
    //       url: "#",

    //     },
    //     {
    //       name: "Travel Bucket List & Inspiration",
    //       url: "#",

    //     },
    //     {
    //       name: "Travel Journal & Photo Gallery",
    //       url: "#",

    //     },
    //   ],
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0 " {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavFavorites favorites={data.favorites} /> */}
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto " />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
