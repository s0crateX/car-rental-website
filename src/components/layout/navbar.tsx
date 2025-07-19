"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAuth, signOut } from "firebase/auth";
import { app, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
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
import Image from 'next/image';

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
  const { user } = useAuth();
  const [adminData, setAdminData] = React.useState<{
    fullName: string;
    email: string;
    profileImageUrl: string;
    userRole: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchAdminData = async () => {
      console.log('user from useAuth:', user);
      if (user) {
        console.log('Fetching admin data for user:', user.uid);
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            console.log('User document found:', userDoc.data());
            if (userDoc.data().userRole === "admin") {
              console.log('User is an admin, setting admin data.');
              setAdminData(userDoc.data() as {
                fullName: string;
                email: string;
                profileImageUrl: string;
                userRole: string;
              });
            } else {
              console.log('User is not an admin.');
            }
          } else {
            console.log('User document not found.');
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
        }
      } else {
        console.log('No user is currently authenticated.');
      }
    };
    fetchAdminData();
  }, [user]);

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
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl">
              <Image src="/assets/images/logo.png" alt="GenRide Logo" width={32} height={32} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">
                GenRide
              </h1>
              <p className="text-xs text-muted-foreground -mt-1 font-medium">Admin Dashboard</p>
            </div>
          </Link>
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


          {/* Profile Dropdown - Enhanced */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 p-1 hover:bg-accent rounded-xl transition-all duration-200 cursor-pointer hover:shadow-sm">
                <Avatar className="h-8 w-8 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                  <AvatarImage src={adminData?.profileImageUrl || ""} alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                    {adminData?.fullName?.split(' ').map(name => name[0]).join('') || 'AU'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-foreground">{adminData?.fullName || "Admin User"}</p>
                  <p className="text-xs text-muted-foreground">{adminData?.email || "admin@genride.com"}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-3 shadow-xl border-border/40 bg-background/95 backdrop-blur-lg">
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                    <AvatarImage src={adminData?.profileImageUrl || ""} alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                      {adminData?.fullName?.split(' ').map(name => name[0]).join('') || 'AU'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{adminData?.fullName || "Admin User"}</p>
                    <p className="text-xs text-muted-foreground">{adminData?.email || "admin@genride.com"}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">{adminData?.userRole || "Administrator"}</Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild className="gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <Link href="/dashboard/settings">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Profile Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be redirected to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className={buttonVariants({ variant: "destructive" })}>Sign Out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl">
                        <Image src="/assets/images/logo.png" alt="GenRide Logo" width={32} height={32} />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold">
                          GenRide
                        </h1>
                        <p className="text-xs text-muted-foreground -mt-1 font-medium">Admin Dashboard</p>
                      </div>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-4">
                  <Link href="/dashboard" className="w-full">
                    <Button 
                      variant="ghost" 
                      className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground w-full"
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
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
                            <Link 
                              key={component.title} 
                              href={component.href}
                              className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {component.title}
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
                            <Link 
                              key={component.title} 
                              href={component.href}
                              className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {component.title}
                            </Link>
                          ))}
                        </nav>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Link href="/dashboard/fleet-management" className="w-full">
                    <Button 
                      variant="ghost" 
                      className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground w-full"
                    >
                      <Car className="h-4 w-4" />
                      Fleet Management
                    </Button>
                  </Link>
                  <Link href="/dashboard/user-management" className="w-full">
                    <Button 
                      variant="ghost" 
                      className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground w-full"
                    >
                      <Users className="h-4 w-4" />
                      User Management
                    </Button>
                  </Link>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/dashboard/settings" className="w-full">
                      <Button 
                        variant="ghost" 
                        className="justify-start h-10 px-3 text-sm gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium text-muted-foreground w-full"
                      >
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Button>
                    </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="justify-start h-10 px-3 text-sm gap-3 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg font-medium text-muted-foreground w-full"
                      >
                        <LogOut className="h-4 w-4" />
                          Sign Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be redirected to the login page.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className={buttonVariants({ variant: "destructive" })}>Sign Out</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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