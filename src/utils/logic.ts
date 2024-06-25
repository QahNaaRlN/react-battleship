import { Board, CellProps } from '../types.ts';
import { BOARD_SIZE } from "./constants.ts";

// Генерация случайного целого числа в диапазоне [min, max]
export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создание пустой доски
export function createEmptyBoard(): Board {
    return Array.from({ length: BOARD_SIZE }, (_, x) =>
        Array.from({ length: BOARD_SIZE }, (_, y) => ({
            ship: null,
            status: 'water',
            x: x,
            y: y,
        })) as CellProps[]
    ) as Board;
}

// Проверка, свободна ли ячейка
export function isCellFree(board: Board, x: number, y: number): boolean {
    const directions: [number, number][] = [
        [0, 1], [1, 0], [0, -1], [-1, 0],
        [1, 1], [1, -1], [-1, -1], [-1, 1]
    ];
    for (const [dx, dy] of directions) {
        const checkX = x + dx;
        const checkY = y + dy;
        if (checkX >= 0 && checkX < board.length && checkY >= 0 && checkY < board[0].length) {
            if (board[checkX][checkY].ship !== null) {
                return false;
            }
        }
    }
    return true;
}
