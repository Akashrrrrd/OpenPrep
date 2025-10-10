"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto w-full max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1"
        >
          OpenPrep
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
              <Link className="text-sm hover:underline underline-offset-4" href="/feedback">
                Feedback
              </Link>
            </li>
            <li>
              <a
                className="text-sm hover:underline underline-offset-4"
                href="https://github.com/"
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
            <Button size="sm">Contribute</Button>
          </Link>
          <Link href="/feedback" className="hidden sm:block">
            <Button size="sm" variant="outline">Feedback</Button>
          </Link>
          <Button
            variant="ghost"
            size="default"
            onClick={toggleTheme}
            className="hidden sm:block h-10 w-10 p-0 relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden border-t">
        <div className="mx-auto w-full max-w-6xl px-4 py-2 flex items-center justify-between text-sm">
          <Link className="hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="hover:underline underline-offset-4" href="/contribute">
            Contribute
          </Link>
          <Link className="hover:underline underline-offset-4" href="/feedback">
            Feedback
          </Link>
          <a
            className="hover:underline underline-offset-4"
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}
