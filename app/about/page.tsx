"use client"

import {Poppins} from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export default function About() {

    return (
        <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <h1 className="text-4xl font-bold">About</h1>
        </main>
    )
}