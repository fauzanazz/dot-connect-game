"use client"

import {Poppins} from "next/font/google";
import GameSettings from "@/components/GameSettings";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {BoardSize, GetBoardColorConnect, GetBoardDotConnect} from "@/actions/GenerateBoard";
import DotConnectGame from "@/components/DotConnect";
import {FinishGame} from "@/components/FinishGame";
import {solveAStar, solveBFS, solveDFS, solveIDDFS} from "@/actions/IsSolvable";
import {ErrorCard} from "@/components/ErrorCard";
import {timeout} from "d3";
import ColorConnect from "@/components/ColorConnect";

const font = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export default function Scoreboard() {

    return (
        <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <h1 className="text-4xl font-bold">Scoreboard</h1>
        </main>
    )
}