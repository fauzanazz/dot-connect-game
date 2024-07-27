"use server"

import {isSolvableAStar} from "@/actions/IsSolvable";

export type BoardSize = 'beginner' | 'easy' | 'medium' | 'hard';

const boardSizes: { [key in BoardSize]: [number, number] } = {
    beginner: [5, 5],
    easy: [8, 6],
    medium: [10, 6],
    hard: [12, 8]
};

export const GetBoard = async (size: BoardSize) => {
    if (!size || !(size in boardSizes)) {
        throw new Error('Invalid board size');
    }

    let board;
    let attempts = 0;
    do {
        attempts++;
        board = generateBoard(size as BoardSize);
        if (attempts > 100000) {
            throw new Error('Failed to generate a solvable board');
        }
        console.log('Checking if solvable...');
    } while (!isSolvableAStar(board.board));

    return board;
}

const generateBoard = (size: BoardSize) => {
    const [rows, cols] = boardSizes[size];
    const board: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0)); // Initialize all nodes as open

    // Generate start point
    const start = generateStartPoint(rows, cols);
    board[start[0]][start[1]] = 2; // Mark the starting point with 2

    const path = generateComplexPath(rows, cols, start);
    for (const [r, c] of path) {
        if (board[r][c] !== 2) {
            board[r][c] = 3; // Mark the path with 3
        }
    }

    // Place obstacles in the remaining cells
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 0) {
                board[r][c] = 1; // Mark the obstacle
            }
        }
    }

    return { board };
};

const generateStartPoint = (rows: number, cols: number): [number, number] => {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    return [r, c];
};

const generateComplexPath = (rows: number, cols: number, start: [number, number]): [number, number][] => {
    const path: [number, number][] = [];
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    const totalCells = rows * cols;
    const minPathLength = Math.floor(totalCells * 0.8);

    const backtrack = (r: number, c: number): boolean => {
        if (path.length >= minPathLength) {
            return true;
        }

        const validMoves = directions.filter(([dr, dc]) => {
            const newRow = r + dr;
            const newCol = c + dc;
            return newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol];
        });

        // Shuffle valid moves to introduce randomness
        for (let i = validMoves.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [validMoves[i], validMoves[j]] = [validMoves[j], validMoves[i]];
        }

        for (const [dr, dc] of validMoves) {
            const newRow = r + dr;
            const newCol = c + dc;
            path.push([newRow, newCol]);
            visited[newRow][newCol] = true;

            if (backtrack(newRow, newCol)) {
                return true;
            }

            // Backtrack
            path.pop();
            visited[newRow][newCol] = false;
        }

        return false;
    };

    const [startRow, startCol] = start;
    path.push([startRow, startCol]);
    visited[startRow][startCol] = true;
    backtrack(startRow, startCol);

    return path;
}