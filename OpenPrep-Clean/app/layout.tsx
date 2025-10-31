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
  title: {
    default: "OpenPrep - AI-Enhanced Interview Preparation Platform",
    template: "%s | OpenPrep"
  },
  description:
    "Master your interviews with OpenPrep's AI-powered platform. Get personalized questions, real-time feedback, and comprehensive preparation resources for technical and HR interviews.",
  keywords: [
    "interview preparation",
    "AI interview practice",
    "Chrome AI",
    "technical interviews",
    "HR interviews",
    "career coaching",
    "job preparation",
    "interview questions",
    "AI-powered learning",
    "placement preparation"
  ],
  authors: [{ name: "OpenPrep Team" }],
  creator: "OpenPrep",
  publisher: "OpenPrep",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://openprep.vercel.app",
    title: "OpenPrep - AI-Enhanced Interview Preparation Platform",
    description: "Master your interviews with AI-powered personalized coaching, real-time feedback, and comprehensive preparation resources.",
    siteName: "OpenPrep",
    images: [
      {
        url: "/logos/logo.png",
        width: 1200,
        height: 630,
        alt: "OpenPrep - AI Interview Preparation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenPrep - AI-Enhanced Interview Preparation",
    description: "Master your interviews with AI-powered personalized coaching and real-time feedback.",
    images: ["/logos/logo.png"],
    creator: "@openprep",
  },
  verification: {
    google: "37180a934069a7c5",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  metadataBase: new URL("https://openprep.vercel.app"),
  alternates: {
    canonical: "https://openprep.vercel.app",
  },
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
