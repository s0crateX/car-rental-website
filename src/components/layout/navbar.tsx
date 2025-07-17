"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  MenuIcon, 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Car, 
  Users, 
  Settings,
  LogOut,
  User,
  Bell,
  Search
} from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center h-16 px-4 mx-auto max-w-screen-2xl">
        
        {/* Brand/Logo Section */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Car Rental
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="items-center justify-center flex-1 hidden gap-2 mx-8 lg:flex ml-16">
          <Button 
            variant="ghost" 
            className="h-10 px-4 gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="h-10 px-4 gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
          >
            <Upload className="h-4 w-4" />
            User Documents
          </Button>
          <Button 
            variant="ghost" 
            className="h-10 px-4 gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
          >
            <FileText className="h-4 w-4" />
            Owner Documents
          </Button>
          <Button 
            variant="ghost" 
            className="h-10 px-4 gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
          >
            <Car className="h-4 w-4" />
            Car Management
          </Button>
          <Button 
            variant="ghost" 
            className="h-10 px-4 gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
          >
            <Users className="h-4 w-4" />
            Users
          </Button>
        </nav>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Search Button - Hidden on mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden h-9 w-9 hover:bg-gray-100 transition-colors rounded-lg md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              2
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@carrental.com</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@carrental.com</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <User className="h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100 transition-colors rounded-lg">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <SheetTitle className="text-left flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Car Rental
                      </h1>
                      <p className="text-xs text-muted-foreground -mt-1">Admin Dashboard</p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 p-4">
                  <Button 
                    variant="ghost" 
                    className="justify-start h-12 px-4 text-base gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-12 px-4 text-base gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
                  >
                    <Upload className="h-5 w-5" />
                    User Document Uploads
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-12 px-4 text-base gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
                  >
                    <FileText className="h-5 w-5" />
                    Car Owner Documents
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-12 px-4 text-base gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
                  >
                    <Car className="h-5 w-5" />
                    Car Management
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-12 px-4 text-base gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg font-medium"
                  >
                    <Users className="h-5 w-5" />
                    User Management
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}