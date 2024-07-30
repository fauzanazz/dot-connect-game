"use server"

import {isSolvableAStar} from "@/actions/IsSolvableDC";

export type BoardSize = 'beginner' | 'easy' | 'medium' | 'hard';

const boardSizes: { [key in BoardSize]: [number, number] } = {
    beginner: [5, 5],
    easy: [8, 6],
    medium: [10, 6],
    hard: [12, 8]
};

// ======================== Dot Connect ========================

export const GetBoardDotConnect = async (size: BoardSize) => {
    if (!size || !(size in boardSizes)) {
        size = 'beginner';
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

// ======================== Color Connect ========================
const boardSizesColorConnect = {
    beginner: 5,
};
const chain_limit = 5 - 3; // Minimum line length
const iterations = 1000; // Number of iterations

export const GetBoardColorConnect = async (size: string) => {
    if (!size || !(size in boardSizesColorConnect)) {
        size = 'beginner';
    }

    let board;
    // @ts-ignore
    board = generateBoardColorConnect(boardSizesColorConnect[size]);

    return { board };
};

const generateBoardColorConnect = (size: any) => {
    let board: string | any[] = baseMatrix(size);
    for (let step = 0; step < iterations; step++) {
        board = edgeSwitch(board);
        board = shuffle(board);
    }
    console.log('Generated board:', flowPrinter(board));
    console.log('Puzzle board:', flowPrinter_puzzle(board));
    return flowPrinter_puzzle(board);
};

const baseMatrix = (dim: number) => {
    const dic = [1, 2, 3, 4, 5]; // Colors
    const A: string | any[] = [];
    for (let i = 0; i < dim; i++) {
        A.push([]);
        for (let j = 0; j < dim; j++) {
            A[i].push([[i + 1, j + 1], dic[i]]);
        }
    }
    return A;
};

const edgeSwitch = (A: string | any[]) => {
    let sw = false;
    for (let i = 0; i < A.length; i++) {
        if (sw) break;
        for (let k1 = -1; k1 <= 0; k1++) {
            if (sw) break;
            const p = A[i][k1 === -1 ? A[i].length - 1 : 0][0];
            for (let j = 0; j < A.length; j++) {
                if (sw) break;
                if (j === i) continue;
                if (A[j].length === chain_limit) continue;
                for (let k2 = -1; k2 <= 0; k2++) {
                    if (sw) break;
                    const pprime = A[j][k2 === -1 ? A[j].length - 1 : 0][0];
                    if (distance(p, pprime) === 1.0) {
                        const n1 = Math.random();
                        if (n1 > 0.5) {
                            if (k2 === -1) {
                                A[j].pop();
                            } else {
                                A[j].shift();
                            }
                            if (k1 === -1) {
                                A[i].push([pprime, A[i][0][1]]);
                            } else {
                                A[i].unshift([pprime, A[i][0][1]]);
                            }
                            sw = true;
                        }
                    }
                }
            }
        }
    }
    return A;
};

const distance = (p: number[], pprime: number[]) => {
    return Math.sqrt(Math.pow(p[0] - pprime[0], 2) + Math.pow(p[1] - pprime[1], 2));
};

const shuffle = (array: string | any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // @ts-ignore
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const flowPrinter = (A: string | any[]) => {
    const n = 5;
    const na = 0;
    const C = Array.from({ length: n }, () => Array(n).fill(na));

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[i].length; j++) {
            const x = A[i][j][0][0] - 1;
            const y = A[i][j][0][1] - 1;
            C[x][y] = A[i][j][1];
        }
    }

    return C;
};

const flowPrinter_puzzle = (A: string | any[]) => {
    const n = 5;
    const na = 0;
    const C = Array.from({ length: n }, () => Array(n).fill(na));

    for (let i = 0; i < A.length; i++) {
        const x1 = A[i][A[i].length-1][0][0] - 1;
        const y1 = A[i][A[i].length-1][0][1] - 1;
        C[x1][y1] = A[i][A[i].length-1][1];

        const x2 = A[i][0][0][0] - 1;
        const y2 = A[i][0][0][1] - 1;
        C[x2][y2] = A[i][0][1];
    }
    return C;
};







