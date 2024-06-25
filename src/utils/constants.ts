import {Direction} from "../types.ts";

export const CELL_SIZE = 32;
export const BOARD_SIZE = 10;

// Определение типа для размеров кораблей
export const SHIP_SIZES: number[] = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

// Определение типа для направлений движения
export const directions: Direction = [[1, 0], [0, 1]];
