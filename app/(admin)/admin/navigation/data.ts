// data.ts
import {
  Building,
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  PenTool,
  BarChart3,
  Settings,
  Key,
  ClipboardList,
} from "lucide-react";

// Data structure
export const data = {
  // User Information
  user: {
    name: "John Doe",
    email: "john@realestate.com",
    avatar: "/avatars/john-doe.jpg",
  },
  // Branch Information
  branches: [
    {
      name: "Downtown Office",
      logo: Building,
      type: "Main",
    },
    {
      name: "Suburban Branch",
      logo: Home,
      type: "Satellite",
    },
  ],
  // Main Navigation Menu
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true, // Indicates if the item is active by default
    },
    {
      title: "Properties",
      url: "#",
      icon: Building,
      items: [
        { title: "For Sale", url: "/admin/properties/for-sale" },
        { title: "For Rent", url: "/admin/properties/for-rent" },
        { title: "Manage Listings", url: "/admin/properties/for-management" },
      ],
    },
    {
      title: "Appointments",
      url: "/admin/appointments",
      icon: Calendar,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Blog",
      url: "/admin/blog",
      icon: PenTool,
      items: [
        { title: "All Posts", url: "#" },
        { title: "New Post", url: "#" },
        { title: "Categories", url: "#" },
      ],
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
  ],
  // Services Section
  services: [
    {
      name: "Property Sales",
      url: "#",
      icon: Key,
    },
    {
      name: "Property Rentals",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Property Management",
      url: "#",
      icon: Building,
    },
  ],
};
