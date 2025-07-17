"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { 
  MenuIcon, 
  FileText, 
  Car, 
  Users, 
  Settings,
  LogOut,
  User,
  Bell,
  Shield,
  ChevronDown,
  Home
} from "lucide-react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const userComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Pending Approvals",
    href: "/dashboard/user-documents/pending",
    description: "Review and approve or reject user document submissions.",
  },
  {
    title: "Approval History",
    href: "/dashboard/user-documents/history",
    description: "View the history of all user document submissions and their statuses.",
  },
];

const ownerComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Pending Car Owner Approvals",
    href: "/dashboard/owner-documents/pending",
    description: "Review and approve or reject car owner document submissions.",
  },
  {
    title: "Car Owner Approval History",
    href: "/dashboard/owner-documents/history",
    description: "View the history of all car owner document submissions and their statuses.",
  },
];

export function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center h-16 px-4 mx-auto max-w-screen-2xl lg:px-6">
        
        {/* Brand/Logo Section */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Car className="h-4 w-4 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Car Rental Name
              </h1>
              <p className="text-xs text-muted-foreground -mt-1 font-medium">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="flex-1 hidden lg:flex items-center justify-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="flex items-center gap-1">
              <NavigationMenuItem className="flex items-center">
                <Link href="/dashboard" className={cn(navigationMenuTriggerStyle(), "h-9 px-3")}>
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex items-center">
                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "h-9 px-3")}>
                  <FileText className="h-4 w-4 mr-2" />
                  User Documents
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    {userComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex items-center">
                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "h-9 px-3")}>
                  <Shield className="h-4 w-4 mr-2" />
                  Owner Documents
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    {ownerComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex items-center">
                <Link href="/dashboard/fleet-management" className={cn(navigationMenuTriggerStyle(), "h-9 px-3")}>
                  <Car className="h-4 w-4 mr-2" />
                  Fleet Management
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex items-center">
                <Link href="/dashboard/user-management" className={cn(navigationMenuTriggerStyle(), "h-9 px-3")}>
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-1 ml-auto">

          <ModeToggle />

          {/* Notifications - Enhanced */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-xl hover:shadow-sm"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 rounded-full text-xs text-white flex items-center justify-center border-2 border-background">
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Profile Dropdown - Enhanced */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 p-1 hover:bg-accent rounded-xl transition-all duration-200 cursor-pointer hover:shadow-sm">
                <Avatar className="h-8 w-8 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                    AU
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@carrental.com</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-3 shadow-xl border-border/40 bg-background/95 backdrop-blur-lg">
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                      AU
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@carrental.com</p>
                    <Badge variant="secondary" className="mt-1 text-xs">Administrator</Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">System Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={handleLogout} className="gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button - Enhanced */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-xl hover:shadow-sm">
                  <MenuIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-background/95 backdrop-blur-lg">
                <SheetHeader className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-lg">
                      <Car className="h-5 w-5 text-white" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                    </div>
                    <div>
                      <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                        Car Rental Portal</h1>
                      <p className="text-xs text-muted-foreground -mt-1 font-medium">Admin Dashboard</p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-4">
                  <Button 
                    variant="ghost" 
                    className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="user-documents" className="border-b-0">
                      <AccordionTrigger className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground hover:no-underline">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4" />
                          User Documents
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 pr-2 pb-0">
                        <nav className="flex flex-col gap-1 py-2">
                          {userComponents.map((component) => (
                            <Link key={component.title} href={component.href} legacyBehavior passHref>
                              <a className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                {component.title}
                              </a>
                            </Link>
                          ))}
                        </nav>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="owner-documents" className="border-b-0">
                      <AccordionTrigger className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4" />
                          Owner Documents
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 pr-2 pb-0">
                        <nav className="flex flex-col gap-1 py-2">
                          {ownerComponents.map((component) => (
                            <Link key={component.title} href={component.href} legacyBehavior passHref>
                              <a className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                {component.title}
                              </a>
                            </Link>
                          ))}
                        </nav>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground"
                  >
                    <Car className="h-4 w-4" />
                    Fleet Management
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground"
                  >
                    <Users className="h-4 w-4" />
                    User Management
                  </Button>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground w-full"
                    >
                      <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="justify-start h-10 px-3 text-sm gap-3 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg font-medium text-muted-foreground w-full"
                  >
                    <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}