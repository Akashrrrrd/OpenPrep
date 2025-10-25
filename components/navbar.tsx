"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, User, LogOut, Settings, Crown, Search } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/notifications"
import { GlobalSearch } from "@/components/global-search"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, logout, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    await logout()
    setOpen(false)
  }

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/study-planner", label: "Planner" },
    { href: "/interview", label: "AI Interview" },
    { href: "/chrome-ai-showcase", label: "Chrome AI" },
    { href: "/forum", label: "Forum" },
    { href: "/materials", label: "Materials" },
    { href: "/experiences", label: "Experiences" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
          >
            <img 
              src="/logos/logo.png" 
              alt="OpenPrep Logo" 
              className="h-7 w-7 sm:h-8 sm:w-8 dark:invert" 
            />
            <span className="text-base sm:text-lg font-bold">OpenPrep</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button for Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0 flex-shrink-0"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Desktop Search */}
            <div className="hidden lg:block w-80">
              <GlobalSearch onResultClick={() => {}} />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Actions */}
            {!mounted || loading ? (
              // Loading state - render placeholder to prevent hydration mismatch
              <div className="flex items-center gap-1">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-1">
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {user.subscriptionTier === 'premium' && (
                            <Crown className="h-3 w-3 text-purple-500" />
                          )}
                          <span className="text-xs capitalize text-muted-foreground">
                            {user.subscriptionTier} Plan
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {/* HACKATHON MODE: Hide upgrade link */}
                    {false && user.subscriptionTier === 'free' && (
                      <DropdownMenuItem asChild>
                        <Link href="/pricing">
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center gap-3 p-6 border-b">
                    <img 
                      src="/logos/logo.png" 
                      alt="OpenPrep Logo" 
                      className="h-8 w-8 dark:invert" 
                    />
                    <span className="font-bold text-lg">OpenPrep</span>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 p-6 space-y-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <Link
                        href="/contribute"
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Contribute
                      </Link>
                      <a
                        href="https://github.com/Akashrrrrd/OpenPrep"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-lg font-medium hover:text-primary transition-colors mt-4"
                        onClick={() => setOpen(false)}
                      >
                        GitHub
                      </a>
                    </div>
                  </div>

                  {/* User Section - Only show auth buttons for non-logged in users */}
                  {!user && (
                    <div className="border-t p-6">
                      <div className="space-y-3">
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/auth/login" onClick={() => setOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/auth/register" onClick={() => setOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(false)}
              >
                ← Back
              </Button>
              <h2 className="text-lg font-semibold">Search</h2>
            </div>
            <div className="relative">
              <GlobalSearch onResultClick={() => setSearchOpen(false)} />
            </div>
          </div>
          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setSearchOpen(false)}
          />
        </div>
      )}
    </>
  )
}