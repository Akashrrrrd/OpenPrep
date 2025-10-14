"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Plus } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto w-full max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1"
        >
          <img src="/logos/logo.png" alt="OpenPrep Logo" className="h-10 w-10 dark:invert" />
          <span className="text-xl">OpenPrep</span>
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
              <Link className="text-sm hover:underline underline-offset-4" href="/contribute">
                Contribute
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
          <Link href="/contribute" className="hidden sm:block">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Contribute
            </Button>
          </Link>
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
                  href="/contribute"
                  className="flex items-center gap-2 text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  <Plus className="h-5 w-5" />
                  Contribute
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
