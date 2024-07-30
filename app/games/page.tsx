"use client"

import GameSettings from "@/components/GameSettings";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {BoardSize, GetBoardColorConnect, GetBoardDotConnect} from "@/actions/GenerateBoard";
import DotConnectGame from "@/components/DotConnect";
import {FinishGame} from "@/components/FinishGame";
import { solveAStar, solveBFS, solveDFS, solveIDDFS} from "@/actions/IsSolvableDC";
import {ErrorCard} from "@/components/ErrorCard";
import ColorConnect from "@/components/ColorConnect";
import {useCurrentUser} from "@/hooks/use-current-user";
import {addNewScore, getHighestScoresByUser} from "@/actions/Scoreboard";
import {solveColorConnect} from "@/actions/IsSolvableCC";


export default function Games() {
    const [game, setGame] = useState("dot-connect")
    const [gameMode, setGameMode] = useState("manual")
    const [difficultyLevel, setDifficultyLevel] = useState("easy")
    const [customBoardFile, setCustomBoardFile] = useState(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [board, setBoard] = useState<number[][]>([])
    const [botAlgorithm, setBotAlgorithm] = useState("astar")
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [time, setTime] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [solvedBoard, setSolvedBoard] = useState<number[][]>([])
    const [bestTime, setBestTime] = useState("")

    const user = useCurrentUser();

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
        setStartTime(new Date());

        if (gameMode === "bot") {
            if (game === "Dot Connect") {
                await StartBotMoveDotConnect(board.board);
            } else {
                await StartBotMoveColorConnect(board.board);
            }
        }
    }

    const StartBotMoveColorConnect = async (board: number[][]) => {
        let solvedBoard;
        const startTime = Date.now();
        solvedBoard = await solveColorConnect(board)
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        setTime(timeTaken);

        if (solvedBoard === null) {
            setErrorMessage("Failed to solve the board");
            setIsError(true);
            return;
        }

        setSolvedBoard(solvedBoard)
    }

    const StartBotMoveDotConnect = async (board : number[][]) => {
        let solvedBoard;
        setIsLoading(true)
        const startTime = Date.now();

        switch (botAlgorithm) {
            case "astar":
                solvedBoard = await solveAStar(board);
                break;
            case "dfs":
                solvedBoard = await solveDFS(board);
                break;
            case "iddfs":
                solvedBoard = await solveIDDFS(board);
                break;
            default:
                solvedBoard = await solveAStar(board);
        }
        setIsLoading(false)
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        setTime(timeTaken)

        if (solvedBoard === null) {
            setErrorMessage("Failed to solve the board");
            setIsError(true);
            return;
        }

        setSolvedBoard(solvedBoard)

    }

    const handleOnFinished = async () => {
        const endTime = new Date();

        // @ts-ignore
        const duration = endTime.getTime() - startTime.getTime();
        const mode = gameMode;
        let level = difficultyLevel;
        if (mode === "bot") {
            level = "custom";
        }
        const userId = user!.id;
        await addNewScore(duration.toString(), game, mode, level, userId);
        console.log("Score added successfully!");

        // Get the new best score
        const newBestScore = await getHighestScoresByUser(userId, game, mode, level);
        console.log(userId, game, mode, level, newBestScore)
        if (newBestScore.success) {
            const score = newBestScore.success[0].score.toString();
            setBestTime(score);
        }

        setTime(duration);
        setIsFinished(true);
    }

    const handleOnNewGame = () => {
        setSolvedBoard([]);
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
            { isFinished && <FinishGame time={time} bestTime={bestTime} onNewGame={handleOnNewGame}/>}
            { isError && <ErrorCard error={errorMessage} onHide={handleOnErrorClose}/>}
        </main>
    )
}