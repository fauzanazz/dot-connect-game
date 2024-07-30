"use server"

// Type alias for the board
type Board = number[][];

// Global variables
let stepCount = 0; // Counter for steps taken
const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Possible movement directions (right, down, left, up)

// Check if a position is valid and not visited
function isValid(x: number, y: number, size: number, visited: boolean[][]): boolean {
    return (x >= 0 && y >= 0 && x < size && y < size && !visited[x][y]);
}

// Find the first unvisited cell with a color
function findUnvisitedColor(board: number[][], size: number, visited: boolean[][]): [number, number] {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] !== 0 && !visited[x][y]) {
                return [x, y];
            }
        }
    }
    return [-1, -1]; // Return -1, -1 if no unvisited color is found
}

// Depth-first search to check if a path exists for the given color
function depthFirstSearch(color: number, x: number, y: number, visited: boolean[][], board: number[][], size: number, pathVisited: boolean[][]): boolean {
    pathVisited[x][y] = true;
    for (let dir = 0; dir < 4; dir++) {
        const newX = x + directions[dir][0];
        const newY = y + directions[dir][1];
        if (newX >= 0 && newY >= 0 && newX < size && newY < size && !pathVisited[newX][newY]) {
            if (board[newX][newY] === color) {
                return true; // Path found
            } else if (board[newX][newY] === 0) {
                if (depthFirstSearch(color, newX, newY, visited, board, size, pathVisited)) {
                    return true; // Continue searching
                }
            }
        }
    }
    pathVisited[x][y] = false;
    return false; // No path found
}

// Check if there is a deadlock in the board
function hasDeadlock(board: number[][], size: number, visited: boolean[][], path: boolean[]): boolean {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] > 0 && !path[board[x][y]]) {
                const pathVisited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
                if (!depthFirstSearch(board[x][y], x, y, visited, board, size, pathVisited)) {
                    return true; // Deadlock found
                }
            }
        }
    }
    return false; // No deadlock
}

// Explore a region to count the number of cells
function exploreRegion(x: number, y: number, board: number[][], size: number, visited: boolean[][], count: { value: number }): void {
    visited[x][y] = true;
    for (let dir = 0; dir < 4; dir++) {
        const newX = x + directions[dir][0];
        const newY = y + directions[dir][1];
        if (newX >= 0 && newY >= 0 && newX < size && newY < size) {
            if (board[newX][newY] > 0) {
                count.value++;
            } else if (board[newX][newY] === 0 && !visited[newX][newY]) {
                exploreRegion(newX, newY, board, size, visited, count);
            }
        }
    }
}

// Check if there is an isolated region in the board
function hasIsolatedRegion(board: number[][], size: number): boolean {
    const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (!visited[x][y] && board[x][y] === 0) {
                const count = { value: 0 };
                exploreRegion(x, y, board, size, visited, count);
                if (count.value === 0) {
                    return true; // Isolated region found
                }
            }
        }
    }
    return false; // No isolated region
}

// Recursive function to solve the puzzle
function solvePuzzle(x: number, y: number, board: number[][], size: number, visited: boolean[][], color: number, path: boolean[]): boolean {
    visited[x][y] = true;
    stepCount++;
    if (hasDeadlock(board, size, visited, path)) {
        visited[x][y] = false;
        return false; // Deadlock detected
    }
    if (hasIsolatedRegion(board, size)) {
        visited[x][y] = false;
        return false; // Isolated region detected
    }
    for (let dir = 0; dir < 4; dir++) {
        const newX = x + directions[dir][0];
        const newY = y + directions[dir][1];
        if (isValid(newX, newY, size, visited)) {
            if (board[newX][newY] === color) {
                visited[newX][newY] = true;
                path[color] = true;
                const [nextX, nextY] = findUnvisitedColor(board, size, visited);
                if (nextX === -1 && nextY === -1) {
                    return true; // Puzzle solved
                }
                const nextColor = board[nextX][nextY];
                if (solvePuzzle(nextX, nextY, board, size, visited, nextColor, path)) {
                    return true; // Continue solving
                }
                visited[newX][newY] = false;
                path[color] = false;
            } else if (board[newX][newY] === 0) {
                board[newX][newY] = color;
                if (solvePuzzle(newX, newY, board, size, visited, color, path)) {
                    return true; // Continue solving
                }
                board[newX][newY] = 0;
            }
        }
    }
    visited[x][y] = false;
    return false; // No solution found
}

// Main function to solve the color connect puzzle
export async function solveColorConnect(board: Board): Promise<Board | null> {
    const size = board.length;
    const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    const path: boolean[] = Array(size * size).fill(false);
    const [startX, startY] = findUnvisitedColor(board, size, visited);
    if (startX === -1 && startY === -1) {
        return board; // Puzzle already solved
    }
    const startColor = board[startX][startY];
    visited[startX][startY] = true;
    if (solvePuzzle(startX, startY, board, size, visited, startColor, path)) {
        return board; // Puzzle solved
    }
    return null; // No solution found
}
