import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface FinishGameProps {
    time: number;
    bestTime: string;
    onNewGame: () => void;
}


export function FinishGame({time, bestTime, onNewGame}: FinishGameProps) {

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(2);
        return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
    }

    const formattedTime = formatTime(time);
    const formattedBestTime = bestTime

    const handleNewGame = () => {
        onNewGame();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <Card className="w-[350px] z-10">
                <CardHeader>
                    <CardTitle>Great Job!</CardTitle>
                    <CardDescription>You finished the game</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label>Time : {formattedTime}<br/></Label>
                    <Label>Best Time : {formattedBestTime} </Label>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={handleNewGame}>New Game</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
