import {Poppins} from "next/font/google";
import GameSettings from "@/components/GameSettings";

const font = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export default function Games() {
    return (
        <main className="flex h-full flex-col items-center justify-center">
            <GameSettings />
        </main>
    )
}