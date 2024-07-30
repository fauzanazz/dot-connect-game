import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import React from "react";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";

const fontHeading = IBM_Plex_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-heading',
    weight: ['700'],
})

const fontBody = IBM_Plex_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
    weight: ['400'],
})

export const metadata: Metadata = {
  title: 'Color Connect Game',
  description: 'Task IRK',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const session = await auth()
  return (
      <SessionProvider session={session}>
          <html lang="en">
          <body
              className={cn(
                  'antialiased',
                  fontHeading.variable,
                  fontBody.variable
              )}
          >
          {children}
          </body>
          </html>
      </SessionProvider>
  )
}
