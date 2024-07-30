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

interface ErrorCardProps {
    error: string;
    onHide: () => void; // Add this line
}

export function ErrorCard({error, onHide}: ErrorCardProps) { // Update this line
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <Card className="w-[350px] z-10">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>You encounter an error</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label>{error}</Label>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={onHide}>Close</Button> {/* Update this line */}
                </CardFooter>
            </Card>
        </div>
    )
}
