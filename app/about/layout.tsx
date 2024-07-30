import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import Navbar from "@/components/navbar";

const fontHeading = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-heading',
})

const fontBody = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
})

// @ts-ignore
export default function Layout({ children }) {
    return (
        <html lang="en">
        <body
            className={cn(
                'antialiased',
                fontHeading.variable,
                fontBody.variable
            )}
        >
        <Navbar />
        {children}
        </body>
        </html>
    )
}