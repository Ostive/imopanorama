"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const services = [
  {
    name: "Rent",
    items: ["Available Properties", "Rental Guide", "Advice"],
  },
  {
    name: "Buy",
    items: ["Property Types", "Estimates", "Financing Assistance"],
  },
  {
    name: "Sell",
    items: ["Property Valuation", "Selling Tips", "Partners"],
  },
  {
    name: "Build",
    items: ["Construction Projects", "Partner Architects", "Financing"],
  },
  {
    name: "Manage",
    items: ["Property Management", "Maintenance Services", "Owner Advice"],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDropdowns, setOpenDropdowns] = React.useState<Set<string>>(
    new Set()
  );

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleDropdownToggle = (serviceName: string) => {
    setOpenDropdowns((prevOpenDropdowns) => {
      const newOpenDropdowns = new Set(prevOpenDropdowns);
      if (newOpenDropdowns.has(serviceName)) {
        newOpenDropdowns.delete(serviceName);
      } else {
        newOpenDropdowns.add(serviceName);
      }
      return newOpenDropdowns;
    });
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="bg-gray-100 py-1 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-xs"
            >
              <MapPin className="w-3 h-3 mr-1" />
              <span>Our Agency</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-xs"
            >
              <Heart className="w-3 h-3 mr-1" />
              <span>My Favorites</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-xs rounded-full">
              Login
            </Button>
            <Button variant="ghost" size="sm" className="text-xs rounded-full">
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white">
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
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <NavigationMenu>
                <NavigationMenuList>
                  {services.map((service) => (
                    <NavigationMenuItem key={service.name}>
                      <NavigationMenuTrigger>
                        {service.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href="/"
                              >
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  {service.name}
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Explore our {service.name.toLowerCase()}{" "}
                                  options and services.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {service.items.map((item) => (
                            <ListItem key={item} title={item} href="/">
                              {item} related services and information.
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="hidden lg:flex lg:items-center">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Post a Listing
              </Button>
            </div>
            <div className="flex items-center space-x-2 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600"
              >
                <MapPin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-600"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
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
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
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
                  <span>{service.name}</span>
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      openDropdowns.has(service.name) ? "rotate-180" : ""
                    )}
                  />
                </div>
              </button>
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden",
                  openDropdowns.has(service.name)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                {service.items.map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            href="/our-agency"
            className="flex items-center text-gray-600 hover:text-primary hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Our Agency
          </Link>
          <Link
            href="/favorites"
            className="flex items-center text-gray-600 hover:text-primary hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
          >
            <Heart className="w-5 h-5 mr-2" />
            My Favorites
          </Link>
          <div className="flex justify-between px-3 py-2">
            <Link
              href="/login"
              className="flex-1 mr-2 text-center py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 ml-2 text-center py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </div>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export { Navbar };
