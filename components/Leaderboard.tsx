"use client"

import {JSX, SVGProps, useEffect, useMemo, useState} from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {getFiveHighestScores} from "@/actions/Scoreboard";

interface leaderboardItems {
    rank: number
    name: string
    time: string
    level: string
    mode: string
}

interface leaderboardProps {
    leaderboardList: leaderboardItems[]
}

export default function Leaderboard() {
    const [selectedGame, setSelectedGame] = useState("Dot Connect")
    const [selectedLevel, setSelectedLevel] = useState("all")
    const [selectedMode, setSelectedMode] = useState("all")
    const [leaderboardList, setLeaderboardList] = useState<leaderboardItems[]>([])

    useEffect(() => {
        getFiveHighestScores(selectedGame, selectedMode, selectedLevel).then((res) => {
            if (res.success) {
                const transformedData = res.success.map((item, index) => ({
                    rank: index + 1,
                    name: item.user.username ? item.user.username : "Anonymous",
                    time: item.score.toString(),
                    level: item.level,
                    mode: item.mode
                }));
                setLeaderboardList(transformedData);
            }
        })
    }, [selectedGame, selectedLevel, selectedMode])

    return (
        <div className="bg-background rounded-lg border p-6 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <span>Game</span>
                                <ChevronsUpDownIcon className="w-4 h-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                            <DropdownMenuRadioGroup value={selectedGame} onValueChange={setSelectedGame}>
                                <DropdownMenuRadioItem value="Dot Connect">Dot Connect</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Color Connect">Color Connect</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <span>Level</span>
                                <ChevronsUpDownIcon className="w-4 h-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                            <DropdownMenuRadioGroup value={selectedLevel} onValueChange={setSelectedLevel}>
                                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="beginner">Beginner</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="easy">Easy</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="hard">Hard</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <span>Mode</span>
                                <ChevronsUpDownIcon className="w-4 h-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                            <DropdownMenuRadioGroup value={selectedMode} onValueChange={setSelectedMode}>
                                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="manual">Manual</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="bot">Bot</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Time (ms)</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Mode</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaderboardList.map((item) => (
                        <TableRow key={item.rank}>
                            <TableCell className="font-medium">{item.rank}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.time}</TableCell>
                            <TableCell>{item.level}</TableCell>
                            <TableCell>{item.mode}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function ChevronsUpDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
        </svg>
    )
}

