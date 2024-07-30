import {Poppins} from "next/font/google";
import Leaderboard from "@/components/Leaderboard";

const font = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export default function Scoreboard() {

    return (
        <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Leaderboard />
        </main>
    )
}