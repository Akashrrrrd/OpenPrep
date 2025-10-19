import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "OpenPrep",
  description:
    "OpenPrep is a free, student-friendly hub for company-wise placement preparation resources with verified Google Drive links.",
  icons: {
    icon: [
      {
        url: "/logos/favicon-white.svg",
        sizes: "16x16",
        type: "image/svg+xml",
      },
      {
        url: "/logos/favicon-white.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/logos/favicon-white.svg",
    apple: "/logos/favicon-white.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
              <main className="min-h-[calc(100dvh-200px)]">{children}</main>
              <Footer />
            </Suspense>
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
