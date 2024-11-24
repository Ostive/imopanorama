"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  MapPin,
  LogOut,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const isConnected = false;
const user = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
};

export  function PublicNavbar() {
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

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <nav
      //   className="bg-white shadow-md fixed top-0 left-0 right-0 z-50"
      className="bg-white shadow-md top-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Top Bar - Hidden on mobile */}
      <div className="bg-sky-400 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center space-x-4 h-10">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-sm font-black rounded-full text-black hover:bg-sky-500"
            >
              <MapPin className="w-3 h-3 mr-1" aria-hidden="true" />
              <span>Our Agency</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-sm font-black rounded-full text-black hover:bg-sky-500"
            >
              <Heart className="w-3 h-3 mr-1" aria-hidden="true" />
              <span>My Favorites</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src="/logo.png"
                  alt="RealtyPro Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
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
                      <NavigationMenuTrigger className="text-lg font-bold">
                        {service.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <Link
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href={`/${service.name.toLowerCase()}`}
                              >
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  {service.name}
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Explore our {service.name.toLowerCase()}{" "}
                                  options and services.
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          {service.items.map((item) => (
                            <ListItem
                              key={item}
                              title={item}
                              href={`/${service.name.toLowerCase()}/${item
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
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
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              {!isConnected ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 "
                    >
                      <Avatar className="h-9 w-9 text-black">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-600  text-xl font-black">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button className="bg-primary rounded-full text-primary-foreground hover:bg-primary/90">
                Post a Listing
              </Button>
            </div>
            <div className="flex items-center space-x-2 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600"
                aria-label="Our Agency"
              >
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600"
                aria-label="My Favorites"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
              </Button>
              {!isConnected ? (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-600"
                    aria-label="Login"
                  >
                    <User className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-600"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
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
        id="mobile-menu"
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
                aria-expanded={openDropdowns.has(service.name)}
              >
                <div className="flex items-center justify-between">
                  <span>{service.name}</span>
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      openDropdowns.has(service.name) ? "rotate-180" : ""
                    )}
                    aria-hidden="true"
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
                    href={`/${service.name.toLowerCase()}/${item
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
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
            className="flex items-center text-gray-600 hover:text-primary hover:bg-gray-50 block px-3 py-2 rounded-full text-base font-medium"
          >
            <MapPin className="w-5 h-5 mr-2" aria-hidden="true" />
            Our Agency
          </Link>
          <Link
            href="/favorites"
            className="flex items-center text-gray-600 hover:text-primary hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
          >
            <Heart className="w-5 h-5 mr-2" aria-hidden="true" />
            My Favorites
          </Link>
          {!isConnected ? (
            <div className="flex justify-between px-3 py-2">
              <Link
                href="/login"
                className="flex-1 mr-2 text-center py-2 rounded-full text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 ml-2 text-center py-2 rounded-full text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="px-3 py-2">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start mt-2"
                asChild
              >
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start mt-2">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          )}
          <div className="mt-4 px-3">
            <Button className="w-full bg-primary rounded-full text-primary-foreground hover:bg-primary/90">
              Post a Listing
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
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
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


