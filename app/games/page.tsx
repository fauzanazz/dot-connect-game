"use client"

import {Poppins} from "next/font/google";
import GameSettings from "@/components/GameSettings";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {BoardSize, GetBoard} from "@/actions/GenerateBoard";
import DotConnectGame from "@/components/DotConnect";
import {FinishGame} from "@/components/FinishGame";
import {solveAStar, solveBFS, solveDFS, solveIDDFS} from "@/actions/IsSolvable";
import {ErrorCard} from "@/components/ErrorCard";
import {timeout} from "d3";

const font = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export default function Games() {
    const [gameMode, setGameMode] = useState("manual")
    const [difficultyLevel, setDifficultyLevel] = useState("easy")
    const [customBoardFile, setCustomBoardFile] = useState(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [board, setBoard] = useState<number[][]>([])
    const [botAlgorithm, setBotAlgorithm] = useState("astar")
    const [time, setTime] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [solvedBoard, setSolvedBoard] = useState<number[][]>([])

    useEffect(() => {
        if (!gameStarted) return;

        const interval = setInterval(() => {
            if (isFinished) {
                clearInterval(interval);
                return;
            }
            setTime(time => time + 1);
        }, 1);

        return () => clearInterval(interval);
    },[gameStarted, isFinished]);

    const handleOnGameSettingsChange = (settings: { gameMode: any; difficultyLevel: any; customBoardFile: any; botAlgorithm: any }) => {
        const {gameMode, difficultyLevel, customBoardFile} = settings;
        setGameMode(gameMode);
        setDifficultyLevel(difficultyLevel);
        setCustomBoardFile(customBoardFile);
        setBotAlgorithm(botAlgorithm);
    }

    const handleOnGameStart = async () => {
        setIsLoading(true);
        const board = customBoardFile ? customBoardFile : await GetBoard(difficultyLevel as BoardSize);
        setBoard(board.board);
        setIsLoading(false);
        setGameStarted(true);
        if (gameMode === "bot") {
            StartBotMove(board.board);
        }
    }

    const StartBotMove = (board : number[][]) => {
        let solvedBoard;
        const startTime = Date.now(); // Record the start time

        switch (botAlgorithm) {
            case "astar":
                solvedBoard = solveAStar(board);
                break;
            case "dfs":
                solvedBoard = solveDFS(board);
                break;
            case "bfs":
                solvedBoard = solveIDDFS(board);
                break;
            default:
                solvedBoard = solveAStar(board);
        }

        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        setTime(timeTaken)

        if (solvedBoard === null) {
            setErrorMessage("Failed to solve the board");
            setIsError(true);
            return;
        }

        setSolvedBoard(solvedBoard)

        setTimeout(() => {
            setIsFinished(true);
        }, 3000)
    }

    const handleOnFinished = () => {
        setIsFinished(true);
    }

    const handleOnNewGame = () => {
        setIsFinished(false);
        setGameStarted(false);
        setTime(0);
    }

    const handleOnErrorClose = () => {
        setIsError(false);
        handleOnNewGame();
    }

    return (
        <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            { !gameStarted && <GameSettings onGameSettingsChange={handleOnGameSettingsChange} onGameStart={handleOnGameStart}/>}
            { isLoading && <Spinner size="large" className="text-blue-950"/>}
            { gameStarted && !isLoading && <DotConnectGame data={board} onFinished={handleOnFinished} solvedData={solvedBoard}/> }
            { isFinished && <FinishGame time={time} bestTime={0} onNewGame={handleOnNewGame}/>}
            { isError && <ErrorCard error={errorMessage} onHide={handleOnErrorClose}/>}
        </main>
    )
}