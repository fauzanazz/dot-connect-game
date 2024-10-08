// @ts-nocheck
"use client"


import { JSX, SVGProps, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {ErrorCard} from "@/components/ErrorCard";

interface GameSettingsProps {
    onGameSettingsChange: (settings: {game: any, gameMode: any; difficultyLevel: any; customBoardFile: any; botAlgorithm: any }) => void;
    onGameStart: () => void;
}

export default function GameSettings({ onGameSettingsChange, onGameStart }: GameSettingsProps) {
    const [game, setGame] = useState("Dot Connect");
    const [gameMode, setGameMode] = useState("manual");
    const [difficultyLevel, setDifficultyLevel] = useState("easy");
    const [customBoardFile, setCustomBoardFile] = useState(null);
    const [botAlgorithm, setBotAlgorithm] = useState("astar");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleGameModeChange = (mode: SetStateAction<string>) => {
        setGameMode(mode);
        onGameSettingsChange({ game, gameMode: mode, difficultyLevel, customBoardFile, botAlgorithm });
    };

    const handleDifficultyLevelChange = (level: SetStateAction<string>) => {
        setDifficultyLevel(level);
        onGameSettingsChange({ game, gameMode, difficultyLevel: level, customBoardFile, botAlgorithm });
    };

    const handleGameChange = (game: SetStateAction<string>) => {
        setGame(game);
        onGameSettingsChange({ game, gameMode, difficultyLevel, customBoardFile, botAlgorithm });
    }

    const handleCustomBoardFileChange = (event: { target: { files: FileList } }) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target.result as string);
                    setCustomBoardFile(content);
                    onGameSettingsChange({ game, gameMode, difficultyLevel, customBoardFile: content, botAlgorithm });
                } catch (error) {
                    setIsError(true);
                    setErrorMessage("Invalid board file, not a JSON probably");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleBotAlgorithmChange = (algorithm: SetStateAction<string>) => {
        setBotAlgorithm(algorithm);
        onGameSettingsChange({ game, gameMode, difficultyLevel, customBoardFile, botAlgorithm: algorithm });
    };

    const handleStartGame = () => {
        onGameStart();
    };

    const handleCustomBoardClick = () => {
        document.querySelector('input[type="file"]').click();
    };

    return (
        <div>
            {isError && ErrorCard({ error: errorMessage, onHide: () => setIsError(false) })}
            <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Game Settings</h1>
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Game</h2>
                    <div className="flex items-center space-x-4">
                        <div
                            className={`flex items-center space-x-2 cursor-pointer ${game === "Dot Connect" ? "text-primary" : "text-muted-foreground"}`}
                            onClick={() => handleGameChange("Dot Connect")}
                        >
                            <HandIcon className="w-5 h-5"/>
                            <span>Dot Connect</span>
                        </div>
                        <div
                            className={`flex items-center space-x-2 cursor-pointer ${game === "Color Connect" ? "text-primary" : "text-muted-foreground"}`}
                            onClick={() => handleGameChange("Color Connect")}
                        >
                            <BotIcon className="w-5 h-5"/>
                            <span>Color Connect</span>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Game Mode</h2>
                    <div className="flex items-center space-x-4">
                        <div
                            className={`flex items-center space-x-2 cursor-pointer ${gameMode === "manual" ? "text-primary" : "text-muted-foreground"}`}
                            onClick={() => handleGameModeChange("manual")}
                        >
                            <HandIcon className="w-5 h-5"/>
                            <span>Manual</span>
                        </div>
                        <div
                            className={`flex items-center space-x-2 cursor-pointer ${gameMode === "bot" ? "text-primary" : "text-muted-foreground"}`}
                            onClick={() => handleGameModeChange("bot")}
                        >
                            <BotIcon className="w-5 h-5"/>
                            <span>Bot</span>
                        </div>
                    </div>
                </div>
                {gameMode === "manual" && (
                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Board</h2>
                        <div className="flex items-center space-x-4">
                            <div
                                className={`flex items-center space-x-2 cursor-pointer ${!customBoardFile ? "text-primary" : "text-muted-foreground"}`}
                                onClick={() => {
                                }}
                            >
                                <Dice1Icon className="w-5 h-5"/>
                                <span>Random</span>
                            </div>
                            <div
                                className={`flex items-center space-x-2 cursor-pointer ${customBoardFile ? "text-primary" : "text-muted-foreground"}`}
                                onClick={handleCustomBoardClick}
                            >
                                <UploadIcon className="w-5 h-5"/>
                                <span>Custom</span>
                            </div>
                            <input type="file" accept=".json" className="hidden"
                                   onChange={handleCustomBoardFileChange}/>
                        </div>
                    </div>
                )}
                {gameMode === "bot" && (
                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Board</h2>
                        <div className="flex items-center space-x-4">
                            <div
                                className={`flex items-center space-x-2 cursor-pointer ${customBoardFile ? "text-primary" : "text-muted-foreground"}`}
                                onClick={handleCustomBoardClick}
                            >
                                <UploadIcon className="w-5 h-5"/>
                                <span>Custom</span>
                            </div>
                            <input type="file" accept=".json" className="hidden"
                                   onChange={handleCustomBoardFileChange}/>
                        </div>
                        <div className="mb-6 mt-6">
                            <h2 className="text-lg font-medium mb-2">Bot Algorithm</h2>
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`flex items-center space-x-2 cursor-pointer ${botAlgorithm === "astar" ? "text-primary" : "text-muted-foreground"}`}
                                    onClick={() => handleBotAlgorithmChange("astar")}
                                >
                                    <CompassIcon className="w-5 h-5"/>
                                    <span>A*</span>
                                </div>
                                {game !== "Color Connect" && <div className="flex items-center space-x-4">
                                    <div
                                        className={`flex items-center space-x-2 cursor-pointer ${botAlgorithm === "iddfs" ? "text-primary" : "text-muted-foreground"}`}
                                        onClick={() => handleBotAlgorithmChange("iddfs")}
                                    >
                                        <LayersIcon className="w-5 h-5"/>
                                        <span>IDDFS</span>
                                    </div>
                                    <div
                                        className={`flex items-center space-x-2 cursor-pointer ${botAlgorithm === "dfs" ? "text-primary" : "text-muted-foreground"}`}
                                        onClick={() => handleBotAlgorithmChange("dfs")}
                                    >
                                        <RewindIcon className="w-5 h-5"/>
                                        <span>DFS / Backtrack</span>
                                    </div>
                                    <div
                                        className={`flex items-center space-x-2 cursor-pointer ${botAlgorithm === "bfs" ? "text-primary" : "text-muted-foreground"}`}
                                        onClick={() => handleBotAlgorithmChange("bfs")}
                                    >
                                        <LayersIcon className="w-5 h-5"/>
                                        <span>BFS</span>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                )}
                {gameMode === "manual" &&
                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Difficulty</h2>
                        <div className="flex items-center space-x-4">
                            <div
                                className={`flex items-center space-x-2 cursor-pointer ${difficultyLevel === "beginner" ? "text-primary" : "text-muted-foreground"}`}
                                onClick={() => handleDifficultyLevelChange("beginner")}
                            >
                                <LeafIcon className="w-5 h-5"/>
                                <span>Beginner</span>
                            </div>
                            {game !== "Color Connect" && (<div className="flex items-center space-x-4">
                                <div
                                    className={`flex items-center space-x-2 cursor-pointer ${difficultyLevel === "easy" ? "text-primary" : "text-muted-foreground"}`}
                                    onClick={() => handleDifficultyLevelChange("easy")}
                                >
                                    <SmileIcon className="w-5 h-5"/>
                                    <span>Easy</span>
                                </div>
                                <div
                                    className={`flex items-center space-x-2 cursor-pointer ${difficultyLevel === "medium" ? "text-primary" : "text-muted-foreground"}`}
                                    onClick={() => handleDifficultyLevelChange("medium")}
                                >
                                    <BoltIcon className="w-5 h-5"/>
                                    <span>Medium</span>
                                </div>
                                <div
                                    className={`flex items-center space-x-2 cursor-pointer ${difficultyLevel === "hard" ? "text-primary" : "text-muted-foreground"}`}
                                    onClick={() => handleDifficultyLevelChange("hard")}
                                >
                                    <FlameIcon className="w-5 h-5"/>
                                    <span>Hard</span>
                                </div>
                            </div>)}
                        </div>
                    </div>}
                <div className="flex justify-end">
                    <Button onClick={handleStartGame}>Start Game</Button>
                </div>
            </div>
        </div>
    );
}


function BoltIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <circle cx="12" cy="12" r="4"/>
        </svg>
    )
}


function BotIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M12 8V4H8"/>
            <rect width="16" height="12" x="4" y="8" rx="2"/>
            <path d="M2 14h2"/>
            <path d="M20 14h2"/>
            <path d="M15 13v2"/>
            <path d="M9 13v2"/>
        </svg>
    )
}


function CompassIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>
            <circle cx="12" cy="12" r="10"/>
        </svg>
    )
}


function Dice1Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <path d="M12 12h.01"/>
        </svg>
    )
}


function FlameIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path
                d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
    )
}


function HandIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
            <path
                d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
        </svg>
    )
}


function LayersIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path
                d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
        </svg>
    )
}


function LeafIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
    )
}



function RewindIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <polygon points="11 19 2 12 11 5 11 19"/>
            <polygon points="22 19 13 12 22 5 22 19"/>
        </svg>
    )
}


function SmileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" x2="9.01" y1="9" y2="9"/>
            <line x1="15" x2="15.01" y1="9" y2="9"/>
        </svg>
    )
}


function UploadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}
