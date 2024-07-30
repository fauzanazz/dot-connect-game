import {IBM_Plex_Mono} from 'next/font/google'
import React from "react";
import Navbar from "@/components/navbar";
import {cn} from "@/lib/utils";


const fontHeading = IBM_Plex_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-heading',
    weight: '700',
})

const fontBody = IBM_Plex_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
    weight: '400',
})

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={cn(
            'antialiased',
            fontHeading.variable,
            fontBody.variable
        )}>
        <Navbar />
        {children}
        </body>
        </html>
    )
}
