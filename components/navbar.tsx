"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"
import SignOut from "@/actions/auth";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export default function Navbar() {
    const { data: user, status } = useSession();
    const isSignedIn = status === "authenticated";
    const router = useRouter();

    const handleSignOut = async () => {
        await SignOut();
        router.push("/");
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-14 items-center">
                    <Link href="#" className="flex items-center" prefetch={false}>
                        <LogoIcon className="h-6 w-6"/>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <nav className="hidden md:flex gap-4">
                        <Link
                            href="#"
                            className="font-medium flex items-center text-sm transition-colors hover:underline"
                            prefetch={false}
                        >
                            Home
                        </Link>
                        <Link
                            href="#"
                            className="font-medium flex items-center text-sm transition-colors hover:underline"
                            prefetch={false}
                        >
                            About
                        </Link>
                    </nav>
                    <div className={`flex items-center gap-4`}>
                        {!isSignedIn && (
                            <>
                                <Button variant="outline" size="sm">
                                    Sign in
                                </Button>
                                <Button size="sm">Sign up</Button>
                            </>
                        )}
                        {
                            isSignedIn && (
                                <div className="flex items-center gap-4">
                                    <Button size="sm" onClick={handleSignOut}>Sign out</Button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

function LogoIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="800"
            viewBox="0 0 1024 1024"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path
                d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z"
                fill="#050D42"/>
            <path
                d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z"
                fill="#050D42"/>
            <path
                d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z"
                fill="#050D42"/>
            <path
                d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z"
                fill="#2F4BFF"/>
        </svg>
    )
}
