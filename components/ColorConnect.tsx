"use client";
import React, { useEffect, useState, useRef } from 'react';
import styles from './ColorConnect.module.css';

interface DotConnectGameProps {
    data: number[][];
    solvedData: number[][];
    onFinished?: () => void;
}

interface Dot {
    row: number;
    col: number;
}

interface Line {
    color?: number;
    from: Dot;
    to: Dot;
}

const colorLine = (number: number) => {
    switch (number) {
        case 1:
            return 'red';
        case 2:
            return 'blue';
        case 3:
            return 'green';
        case 4:
            return 'yellow';
        case 5:
            return 'purple';
    }
}

const ColorConnectGame: React.FC<DotConnectGameProps> = ({ data, onFinished, solvedData }) => {
    const [board, setBoard] = useState(data);
    const [selectedDot, setSelectedDot] = useState<Dot | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [visitedDots, setVisitedDots] = useState<Map<string, number>>(new Map());
    const [stack, setStack] = useState<Dot[]>([]);
    const isDragging = useRef(false);

    useEffect(() => {
        setBoard(data);
        setLines([]);
        setSelectedDot(null);
        setVisitedDots(new Map());
        setStack([]);
    }, [data]);

    useEffect(() => {
        if (!solvedData) return;

        const newLines: Line[] = [];
        const newVisitedDots = new Map<string, number>();
        const length = 5;
        for (let i = 1; i < length; i++) {
            const from = findInMatrix(solvedData, i);
            const to = findInMatrix(solvedData, i + 1);
            if (from && to) {
                newLines.push({ from, to });
                newVisitedDots.set(`${from.row},${from.col}`, i);
                newVisitedDots.set(`${to.row},${to.col}`, i);
            }
        }
        setLines(newLines);
        setVisitedDots(newVisitedDots);
    }, [solvedData]);

    const DefaultBoard = data;

    const findInMatrix = (matrix: number[][], target: number): Dot | null => {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[0].length; c++) {
                if (matrix[r][c] === target) {
                    return { row: r, col: c };
                }
            }
        }
        return null;
    };


    const handleMouseDown = (row: number, col: number) => {
        isDragging.current = true;
        setSelectedDot({ row, col });
        handleClick(row, col);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (row: number, col: number) => {
        if (isDragging.current) {
            handleClick(row, col);
        }
    };

    const handleClick = (row: number, col: number) => {
        if (!selectedDot) return;

        const { row: selectedRow, col: selectedCol } = selectedDot;

        // Check if the clicked dot is adjacent to the selected dot
        if (Math.abs(row - selectedRow) + Math.abs(col - selectedCol) !== 1) return;

        const dotKey = `${row},${col}`;
        if (visitedDots.has(dotKey)) {

            // Remove all lines that has color of the visited dot
            const newLines = lines.filter(line => line.color !== visitedDots.get(dotKey));
            setLines(newLines);

            // Remove all visited dots that has the color of the visited dot
            const newVisitedDots = new Map<string, number>();
            visitedDots.forEach((value, key) => {
                if (value !== visitedDots.get(dotKey)) {
                    newVisitedDots.set(key, value);
                }
            });
            setVisitedDots(newVisitedDots);

            // Remove the visited dot from the stack
            const newStack = stack.filter(dot => `${dot.row},${dot.col}` !== dotKey);
            setStack(newStack);

            // Set the selected dot to the last dot in the stack
            const lastDot = newStack[newStack.length - 1];
            setSelectedDot(lastDot || null);

        } else {
            const newDot = { row, col };
            setSelectedDot(newDot);
            setStack([...stack, newDot]);
            setLines([...lines, { from: selectedDot, to: newDot, color: board[selectedDot.row][selectedDot.col]}]);
            setVisitedDots(new Map(visitedDots.set(dotKey, board[selectedDot.row][selectedDot.col])));
            setBoard(board.map((r, rowIndex) => r.map((c, colIndex) => rowIndex === row && colIndex === col ? board[selectedDot.row][selectedDot.col] : c)));

            for (let r = 0; r < board.length; r++) {
                for (let c = 0; c < board[0].length; c++) {
                    if (DefaultBoard[r][c] !== 0) {
                        if (board[r][c] !== DefaultBoard[r][c]) {
                            const boardCopy = [...board];
                            boardCopy[r][c] = DefaultBoard[r][c];
                            setBoard(boardCopy);
                        }
                    }
                }
            }
        }

        if (allDotsConnected()) {
            onFinished?.();
        }
    };

    const allDotsConnected = (): boolean => {
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[0].length; c++) {
                if (board[r][c] === 0 && !visitedDots.has(`${r},${c}`)) {
                    return false;
                }
            }
        }
        return true;
    };

    return (
        <div className={styles.boardContainer}>
            <div className={styles.board} draggable="false">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.row} draggable="false">
                        {row.map((dot, colIndex) => (
                            <div
                                key={colIndex}
                                className={`${styles.dot}  ${dot !== 0 ? styles[`color-${dot}`] : ""}  ${visitedDots.has(`${rowIndex},${colIndex}`) ? styles[`color-${visitedDots.get(`${rowIndex},${colIndex}`)}`] : ""}`}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                                draggable="false"
                            />
                        ))}
                    </div>
                ))}
                <svg className={styles.lines}>
                    {lines.map((line, index) => (
                        <line
                            key={index}
                            x1={line.from.col * 50 + 25}
                            y1={line.from.row * 50 + 25}
                            x2={line.to.col * 50 + 25}
                            y2={line.to.row * 50 + 25}
                            stroke={colorLine(line.color || 0) || "black"}
                            strokeWidth="2"
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default ColorConnectGame;