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

export default function Games() {
    const [game, setGame] = useState("dot-connect")
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

    const handleOnGameSettingsChange = (settings: { game: any, gameMode: any; difficultyLevel: any; customBoardFile: any; botAlgorithm: any }) => {
        const {game, gameMode, difficultyLevel, customBoardFile} = settings;
        setGame(game)
        setGameMode(gameMode);
        setDifficultyLevel(difficultyLevel);
        setCustomBoardFile(customBoardFile);
        setBotAlgorithm(botAlgorithm);
    }

    const handleOnGameStart = async () => {
        setIsLoading(true);
        let board;

        if (game === "Dot Connect") {
            board = customBoardFile ? customBoardFile : await GetBoardDotConnect(difficultyLevel as BoardSize);
        } else {
            board = customBoardFile ? customBoardFile : await GetBoardColorConnect(difficultyLevel as BoardSize);
        }

        setBoard(board.board);
        setIsLoading(false);
        setGameStarted(true);

        if (gameMode === "bot") {
            if (game === "Dot Connect") {
                StartBotMoveDotConnect(board.board);
            } else {

            }
        }
    }

    const StartBotMoveColorConnect = (board: number[][]) => {

    }

    const StartBotMoveDotConnect = (board : number[][]) => {
        let solvedBoard;
        const startTime = Date.now();

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
        // Upload score to the server
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
            { !gameStarted && !isLoading && <GameSettings onGameSettingsChange={handleOnGameSettingsChange} onGameStart={handleOnGameStart}/>}
            { isLoading && <Spinner size="large" className="text-blue-950"/>}
            { gameStarted && !isLoading && game === "Dot Connect" && <DotConnectGame data={board} onFinished={handleOnFinished} solvedData={solvedBoard}/> }
            { gameStarted && !isLoading && game === "Color Connect" && <ColorConnect data={board} onFinished={handleOnFinished} solvedData={solvedBoard}/> }
            { isFinished && <FinishGame time={time} bestTime={0} onNewGame={handleOnNewGame}/>}
            { isError && <ErrorCard error={errorMessage} onHide={handleOnErrorClose}/>}
        </main>
    )
}