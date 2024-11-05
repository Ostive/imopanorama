"use client";

import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction, // Add this import
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Building, MessageSquare } from "lucide-react";
import { data } from "./data";

import Link from "next/link";


export function SidebarServices() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Services</SidebarGroupLabel>
      <SidebarMenu>
        {data.services.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              {/* <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link> */}

              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>

            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side="bottom"
                align="end"
              >
                <DropdownMenuItem>
                  <Building className="text-muted-foreground" />
                  <span>View Properties</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="text-muted-foreground" />
                  <span>Contact Clients</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
