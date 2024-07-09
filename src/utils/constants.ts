import { Direction } from "../types";

export const CELL_SIZE = 32;
export const CELL_BORDER_WIDTH = 1;
export const TOTAL_CELL_SIZE = CELL_SIZE + 2 * CELL_BORDER_WIDTH;

export const BOARD_SIZE = 10;

export const SHIP_SIZES: number[] = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

export const DIRECTIONS: Direction[] = [[1, 0], [0, 1]];
