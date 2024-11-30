import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import AuthProvider from "@/context/AuthProvider"
import {Toaster} from "@/components/ui/toaster"
import {SpeedInsights} from "@vercel/speed-insights/next"
import {Analytics} from "@vercel/analytics/react"
import {ReactNode} from "react";

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Mystery Message",
    description: "mystery message",
}

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
        <AuthProvider>
            <body className={inter.className}>
            {children}
            <Toaster/>
            <SpeedInsights/>
            <Analytics/>
            </body>
        </AuthProvider>
        </html>
    )
}
