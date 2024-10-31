// components/layout/ConditionalNav.tsx
"use client";

import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";

const ConditionalNav = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return isAdminRoute ? <Sidebar /> : <Navbar />;
};


export { ConditionalNav };
