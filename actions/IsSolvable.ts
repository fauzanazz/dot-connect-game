
const findStartPoint = (board: number[][]): [number, number] => {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === 2) {
                return [r, c];
            }
        }
    }
    return [-1, -1];
};


export const isSolvableAStar = (board: number[][]): boolean => {
    const [startRow, startCol] = findStartPoint(board);
    if (startRow === -1 || startCol === -1) return false;

    const rows = board.length;
    const cols = board[0].length;
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    const openSet = new Set<string>();
    const cameFrom = new Map<string, string>();
    const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

    const startKey = `${startRow},${startCol}`;
    openSet.add(startKey);
    gScore[startRow][startCol] = 0;
    fScore[startRow][startCol] = 0;

    while (openSet.size > 0) {
        let currentKey = '';
        let currentFScore = Infinity;
        // @ts-ignore
        for (const key of openSet) {
            const [r, c] = key.split(',').map(Number);
            if (fScore[r][c] < currentFScore) {
                currentFScore = fScore[r][c];
                currentKey = key;
            }
        }

        const [currentRow, currentCol] = currentKey.split(',').map(Number);
        openSet.delete(currentKey);

        for (const [dr, dc] of directions) {
            const neighborRow = currentRow + dr;
            const neighborCol = currentCol + dc;
            if (neighborRow < 0 || neighborRow >= rows || neighborCol < 0 || neighborCol >= cols || board[neighborRow][neighborCol] === 1) {
                continue;
            }

            const tentativeGScore = gScore[currentRow][currentCol] + 1;
            if (tentativeGScore < gScore[neighborRow][neighborCol]) {
                cameFrom.set(`${neighborRow},${neighborCol}`, currentKey);
                gScore[neighborRow][neighborCol] = tentativeGScore;
                fScore[neighborRow][neighborCol] = tentativeGScore;
                openSet.add(`${neighborRow},${neighborCol}`);
            }
        }
    }

    // Check if all free dots are passed only once
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 0 && !cameFrom.has(`${r},${c}`)) {
                return false;
            }
        }
    }

    return true;
};


export const solveAStar = (board: number[][]): number[][] | null => {
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    const start = findStart(board);
    if (!start) return null;

    const heuristic = (x: number, y: number) => {
        let maxDist = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === 0) {
                    maxDist = Math.max(maxDist, Math.abs(x - i) + Math.abs(y - j));
                }
            }
        }
        return maxDist;
    };

    const pq = new MinHeap<{ x: number, y: number, cost: number, heuristic: number, path: [number, number][] }>();
    pq.insert({ x: start[0], y: start[1], cost: 0, heuristic: heuristic(start[0], start[1]), path: [[start[0], start[1]]] }, 0);

    while (!pq.isEmpty()) {
        const { x, y, cost, path } = pq.extractMin()!;
        if (path.length === rows * cols - countBlocked(board)) {
            return buildResult(path, rows, cols);
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny, board) && !path.some(([px, py]) => px === nx && py === ny)) {
                pq.insert({ x: nx, y: ny, cost: cost + 1, heuristic: heuristic(nx, ny), path: [...path, [nx, ny]] }, cost + 1 + heuristic(nx, ny));
            }
        }
    }

    return null;
};


export const solveBFS = (board: number[][]): number[][] | null => {
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    const start = findStart(board);
    if (!start) return null;

    const queue = [{ x: start[0], y: start[1], path: [[start[0], start[1]]] }];
    while (queue.length > 0) {
        const { x, y, path } = queue.shift()!;
        if (path.length === rows * cols - countBlocked(board)) {
            // @ts-ignore
            return buildResult(path, rows, cols);
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny, board) && !path.some(([px, py]) => px === nx && py === ny)) {
                queue.push({ x: nx, y: ny, path: [...path, [nx, ny]] });
            }
        }
    }

    return null;
};


export const solveDFS = (board: number[][]): number[][] | null => {
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    const start = findStart(board);
    if (!start) return null;

    const result = Array.from({ length: rows }, () => Array(cols).fill(0));
    let step = 1;

    const dfs = (x: number, y: number): boolean => {
        if (step === rows * cols - countBlocked(board)) {
            result[x][y] = step;
            return true;
        }

        result[x][y] = step;
        step++;

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny, board) && result[nx][ny] === 0) {
                if (dfs(nx, ny)) {
                    return true;
                }
            }
        }

        // Backtrack
        result[x][y] = 0;
        step--;
        return false;
    };

    if (dfs(start[0], start[1])) {
        return result;
    }

    return null;
};

export const solveIDDFS = (board: number[][]): number[][] | null => {
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    const start = findStart(board);
    if (!start) return null;

    const maxDepth = rows * cols - countBlocked(board);
    for (let depth = 1; depth <= maxDepth; depth++) {
        const result = depthLimitedSearch(board, start[0], start[1], depth, rows, cols, directions, maxDepth);
        if (result) return result;
    }

    return null;
};

const depthLimitedSearch = (
    board: number[][],
    x: number,
    y: number,
    depth: number,
    rows: number,
    cols: number,
    directions: number[][],
    maxDepth = 1000
): number[][] | null => {
    const stack = [{ x, y, path: [[x, y]], depth: 1 }];
    while (stack.length > 0) {
        const { x, y, path, depth } = stack.pop()!;
        if (depth > maxDepth) continue;
        if (path.length === rows * cols - countBlocked(board)) {
            // @ts-ignore
            return buildResult(path, rows, cols);
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny, board) && !path.some(([px, py]) => px === nx && py === ny)) {
                stack.push({ x: nx, y: ny, path: [...path, [nx, ny]], depth: depth + 1 });
            }
        }
    }

    return null;
};



const findStart = (board: number[][]): [number, number] | null => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 2) {
                return [i, j];
            }
        }
    }
    return null;
};

const isValid = (x: number, y: number, board: number[][]): boolean => {
    return x >= 0 && x < board.length && y >= 0 && y < board[0].length && board[x][y] !== 1;
};

const countBlocked = (board: number[][]): number => {
    let count = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 1) {
                count++;
            }
        }
    }
    return count;
};

const buildResult = (path: [number, number][], rows: number, cols: number): number[][] => {
    const result = Array.from({ length: rows }, () => Array(cols).fill(0));
    path.forEach(([x, y], index) => {
        result[x][y] = index + 1;
    });
    return result;
};

class MinHeap<T> {
    private heap: { element: T; priority: number }[] = [];

    private parent(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private leftChild(index: number): number {
        return 2 * index + 1;
    }

    private rightChild(index: number): number {
        return 2 * index + 2;
    }

    private swap(index1: number, index2: number): void {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    private heapifyUp(index: number): void {
        let currentIndex = index;
        while (currentIndex > 0 && this.heap[currentIndex].priority < this.heap[this.parent(currentIndex)].priority) {
            this.swap(currentIndex, this.parent(currentIndex));
            currentIndex = this.parent(currentIndex);
        }
    }

    private heapifyDown(index: number): void {
        let currentIndex = index;
        while (this.leftChild(currentIndex) < this.heap.length) {
            let smallerChildIndex = this.leftChild(currentIndex);
            if (this.rightChild(currentIndex) < this.heap.length && this.heap[this.rightChild(currentIndex)].priority < this.heap[smallerChildIndex].priority) {
                smallerChildIndex = this.rightChild(currentIndex);
            }
            if (this.heap[currentIndex].priority <= this.heap[smallerChildIndex].priority) {
                break;
            }
            this.swap(currentIndex, smallerChildIndex);
            currentIndex = smallerChildIndex;
        }
    }

    public insert(element: T, priority: number): void {
        this.heap.push({ element, priority });
        this.heapifyUp(this.heap.length - 1);
    }

    public extractMin(): T | undefined {
        if (this.heap.length === 0) {
            return undefined;
        }
        const min = this.heap[0].element;
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown(0);
        return min;
    }

    public isEmpty(): boolean {
        return this.heap.length === 0;
    }
}


class PuzzleState {
    board: number[][];
    cost: number;
    heuristic: number;
    totalCost: number;

    constructor(board: number[][], cost: number = 0, heuristic: number = 0) {
        this.board = board;
        this.cost = cost;
        this.heuristic = heuristic;
        this.totalCost = cost + heuristic;
    }
}

function isGoal(board: number[][]): boolean {
    return board.every(row => row.every(cell => cell !== 0));
}

function getNeighbors(board: number[][], x: number, y: number): [number, number][] {
    const neighbors: [number, number][] = [];
    const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[0].length) {
            neighbors.push([nx, ny]);
        }
    }
    return neighbors;
}

function heuristic(board: number[][]): number {
    return board.reduce((sum, row) => sum + row.filter(cell => cell === 0).length, 0);
}

function aStarSolver(initialBoard: number[][]): number[][] | null {
    const startState = new PuzzleState(initialBoard, 0, heuristic(initialBoard));
    const openList: PuzzleState[] = [startState];
    const closedSet: Set<string> = new Set();

    while (openList.length > 0) {
        openList.sort((a, b) => a.totalCost - b.totalCost);
        const currentState = openList.shift()!;
        const currentBoard = currentState.board;

        if (isGoal(currentBoard)) {
            return currentBoard;
        }

        closedSet.add(JSON.stringify(currentBoard));

        for (let x = 0; x < currentBoard.length; x++) {
            for (let y = 0; y < currentBoard[0].length; y++) {
                if (currentBoard[x][y] === 0) {
                    for (const [nx, ny] of getNeighbors(currentBoard, x, y)) {
                        if (currentBoard[nx][ny] !== 0) {
                            const newBoard = currentBoard.map(row => row.slice());
                            newBoard[x][y] = currentBoard[nx][ny];
                            const newState = new PuzzleState(newBoard, currentState.cost + 1, heuristic(newBoard));
                            if (!closedSet.has(JSON.stringify(newBoard))) {
                                openList.push(newState);
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}

