"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, User, LogOut, Settings, Crown } from "lucide-react"
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

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    await logout()
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto w-full max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1"
        >
          <img src="/logos/logo.png" alt="OpenPrep Logo" className="h-8 w-8 sm:h-10 sm:w-10 dark:invert" />
          <span className="text-lg sm:text-xl">OpenPrep</span>
          <span className="sr-only">{"OpenPrep Home"}</span>
        </Link>
        <nav aria-label="Main Navigation">
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link className="text-sm hover:underline underline-offset-4" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-sm hover:underline underline-offset-4" href="/study-planner">
                Planner
              </Link>
            </li>
            <li>
              <Link className="text-sm hover:underline underline-offset-4" href="/forum">
                Forum
              </Link>
            </li>
            <li>
              <Link className="text-sm hover:underline underline-offset-4" href="/materials">
                Materials
              </Link>
            </li>
            <li>
              <Link className="text-sm hover:underline underline-offset-4" href="/contribute">
                Contribute
              </Link>
            </li>
            <li>
              <Link className="text-sm hover:underline underline-offset-4" href="/experiences/share">
                Share
              </Link>
            </li>
            <li>
              <a
                className="text-sm hover:underline underline-offset-4"
                href="https://github.com/Akashrrrrd/OpenPrep"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
                  {user.subscriptionTier === 'free' && (
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
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="default"
            onClick={toggleTheme}
            className="h-10 w-10 p-0 relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[280px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full p-4 space-y-4">
                <Link
                  href="/"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/study-planner"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Planner
                </Link>
                <Link
                  href="/forum"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Forum
                </Link>
                <Link
                  href="/materials"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Materials
                </Link>
                <Link
                  href="/contribute"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Contribute
                </Link>
                <Link
                  href="/experiences"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Experiences
                </Link>
                <Link
                  href="/experiences/share"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Share
                </Link>
                <a
                  href="https://github.com/Akashrrrrd/OpenPrep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  GitHub
                </a>
                
                {/* Authentication section for mobile */}
                {user ? (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <div className="flex items-center gap-1">
                          {user.subscriptionTier === 'premium' && (
                            <Crown className="h-3 w-3 text-purple-500" />
                          )}
                          <span className="text-xs capitalize text-muted-foreground">
                            {user.subscriptionTier} Plan
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-lg font-medium hover:underline underline-offset-4"
                      onClick={() => setOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 text-lg font-medium hover:underline underline-offset-4"
                      onClick={() => setOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    {user.subscriptionTier === 'free' && (
                      <Link
                        href="/pricing"
                        className="flex items-center gap-2 text-lg font-medium hover:underline underline-offset-4 text-purple-600"
                        onClick={() => setOpen(false)}
                      >
                        <Crown className="h-4 w-4" />
                        Upgrade to Pro
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-lg font-medium hover:underline underline-offset-4 text-red-600 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/login" onClick={() => setOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/auth/register" onClick={() => setOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
