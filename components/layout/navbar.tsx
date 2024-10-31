"use client";

import * as React from "react";
import Link from "next/link";
import {
  Home,
  Building,
  DollarSign,
  Hammer,
  Settings,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const services = [
  {
    name: "Rent",
    icon: <Home className="w-4 h-4 mr-2" />,
    items: ["Available Properties", "Rental Guide", "Advice"],
  },
  {
    name: "Buy",
    icon: <Building className="w-4 h-4 mr-2" />,
    items: ["Property Types", "Estimates", "Financing Assistance"],
  },
  {
    name: "Sell",
    icon: <DollarSign className="w-4 h-4 mr-2" />,
    items: ["Property Valuation", "Selling Tips", "Partners"],
  },
  {
    name: "Build",
    icon: <Hammer className="w-4 h-4 mr-2" />,
    items: ["Construction Projects", "Partner Architects", "Financing"],
  },
  {
    name: "Manage",
    icon: <Settings className="w-4 h-4 mr-2" />,
    items: ["Property Management", "Maintenance Services", "Owner Advice"],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null
  );
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleDropdownToggle = (serviceName: string) => {
    setActiveDropdown((prev) => (prev === serviceName ? null : serviceName));
  };

  const handleDropdownEnter = (serviceName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveDropdown(serviceName);
  };

  const handleDropdownLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Building className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                RealtyPro
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="relative group"
                onMouseEnter={() => handleDropdownEnter(service.name)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  onClick={() => handleDropdownToggle(service.name)}
                  className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  {service.icon}
                  {service.name}
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      activeDropdown === service.name ? "rotate-180" : ""
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out opacity-0 translate-y-1",
                    activeDropdown === service.name
                      ? "opacity-100 translate-y-0"
                      : "pointer-events-none"
                  )}
                >
                  <div className="relative">
                    <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-black border-opacity-5"></div>
                    <div className="relative bg-white rounded-lg z-10">
                      <div className="py-2 px-4 text-sm font-semibold border-b border-gray-100">
                        {service.name}
                      </div>
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        {service.items.map((item) => (
                          <Link
                            key={item}
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
                            role="menuitem"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative w-8 h-8 rounded-full"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/favorites" className="w-full">
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/messages" className="w-full">
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full text-left"
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setIsLoggedIn(true)}>
                  Login
                </Button>
                <Button variant="ghost">Sign Up</Button>
              </>
            )}
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Post a Listing
            </Button>
          </div>
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label="Main menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {services.map((service) => (
            <div key={service.name} className="relative">
              <button
                onClick={() => handleDropdownToggle(service.name)}
                className="w-full text-left text-gray-600 hover:text-primary hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    {service.icon}
                    {service.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      activeDropdown === service.name ? "rotate-180" : ""
                    )}
                  />
                </div>
              </button>
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden",
                  activeDropdown === service.name
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                {service.items.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                Profile
              </Link>
              <Link
                href="/favorites"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                Favorites
              </Link>
              <Link
                href="/messages"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                Messages
              </Link>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                Login
              </button>
              <Link
                href="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                Sign Up
              </Link>
            </>
          )}
          <div className="mt-4 px-3">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Post a Listing
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Navbar };
