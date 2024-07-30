"use client";
import React, { useEffect, useState, useRef } from 'react';
import styles from './DotConnect.module.css';

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
    from: Dot;
    to: Dot;
}

const DotConnectGame: React.FC<DotConnectGameProps> = ({ data, onFinished, solvedData }) => {
    const [board, setBoard] = useState(data);
    const [selectedDot, setSelectedDot] = useState<Dot | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [visitedDots, setVisitedDots] = useState<Map<string, boolean>>(new Map());
    const [stack, setStack] = useState<Dot[]>([]);
    const isDragging = useRef(false);

    useEffect(() => {
        setBoard(data);
        setLines([]);
        const startPoint = FindStartPoint(data);
        setSelectedDot(startPoint);
        setVisitedDots(new Map([[`${startPoint.row},${startPoint.col}`, true]]));
        setStack([startPoint]);
    }, [data]);

    useEffect(() => {
        if (!solvedData) return;

        const newLines: Line[] = [];
        const newVisitedDots = new Map<string, boolean>();
        const length = countNumberOfDots(solvedData);
        for (let i = 1; i < length; i++) {
            const from = findInMatrix(solvedData, i);
            const to = findInMatrix(solvedData, i + 1);
            if (from && to) {
                newLines.push({ from, to });
                newVisitedDots.set(`${from.row},${from.col}`, true);
                newVisitedDots.set(`${to.row},${to.col}`, true);
            }
        }
        setLines(newLines);
        setVisitedDots(newVisitedDots);

        setTimeout(() => {
            onFinished?.();
        }, 3000);
    }, [solvedData]);

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

    const countNumberOfDots = (matrix: number[][]): number => {
        let count = 0;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[0].length; c++) {
                if (matrix[r][c] !== 0) {
                    count++;
                }
            }
        }
        return count;
    }

    const FindStartPoint = (board: number[][]): Dot => {
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[0].length; c++) {
                if (board[r][c] === 2) {
                    return { row: r, col: c };
                }
            }
        }
        return { row: -1, col: -1 };
    };

    const handleMouseDown = (row: number, col: number) => {
        isDragging.current = true;
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

        if (board[row][col] === 1) return; // Cannot pass through blocked dots

        const dotKey = `${row},${col}`;
        if (visitedDots.has(dotKey)) {
            // Revert to the clicked dot state
            const newStack: Dot[] = [];
            const newVisitedDots = new Map<string, boolean>();
            const newLines: Line[] = [];
            for (const dot of stack) {
                newStack.push(dot);
                newVisitedDots.set(`${dot.row},${dot.col}`, true);
                if (dot.row === row && dot.col === col) {
                    break;
                }
                if (newStack.length > 1) {
                    newLines.push({ from: newStack[newStack.length - 2], to: dot });
                }
            }
            setSelectedDot({ row, col });
            setStack(newStack);
            setVisitedDots(newVisitedDots);
            setLines(newLines);
        } else {
            // Add new state and draw line
            const newDot = { row, col };
            setSelectedDot(newDot);
            setStack([...stack, newDot]);
            setLines([...lines, { from: selectedDot, to: newDot }]);
            setVisitedDots(new Map(visitedDots.set(dotKey, true)));
        }

        if (allDotsConnected()) {
            onFinished?.();
        }
    };

    const allDotsConnected = (): boolean => {
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[0].length; c++) {
                if (board[r][c] !== 1 && !visitedDots.has(`${r},${c}`)) {
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
                                className={`${styles.dot} ${dot === 1 ? styles.blocked : ''} ${visitedDots.has(`${rowIndex},${colIndex}`)|| dot === 2 ? styles.connected : ''}`}
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
                            stroke="green"
                            strokeWidth="2"
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default DotConnectGame;
