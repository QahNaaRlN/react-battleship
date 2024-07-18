import { makeAutoObservable } from 'mobx';
import { Board, Position, Direction } from './types';
import Ship from './models/Ship'
import { createEmptyBoard, getRandomInt, isCellFree } from './utils/logic';
import { DIRECTIONS, SHIP_SIZES, BOARD_SIZE } from './utils/constants';

class GameStore {
    board: Board = createEmptyBoard();
    ships: Ship[] = [];
    draggingShipId: number | null = null;
    hoveredCell: Position | null = null;
    isOverBoard: boolean | null = false;

    constructor() {
        makeAutoObservable(this);
        this.populatePortWithShips();
    }

    setIsOverBoard(value: boolean | null): void {
        this.isOverBoard = value;
    }

    setHoveredCell(x: number | null, y: number | null): void {
        this.hoveredCell = x !== null && y !== null ? { x, y } : null;
    }

    isShipOverValidCell(shipId: number): boolean {
        const ship = this.getShipById(shipId);
        if (!ship || !this.hoveredCell) return false;
        return this.canPlaceShip(this.board, ship.size, this.hoveredCell.x, this.hoveredCell.y, ship.direction);
    }

    isShipOverBoard(ship: Ship, nearestCell: Position): boolean {
        const { x: startX, y: startY } = nearestCell;
        const endX = startX + (ship.direction[0] * (ship.size - 1));
        const endY = startY + (ship.direction[1] * (ship.size - 1));

        return this.isWithinBoardBounds(startX, startY) && this.isWithinBoardBounds(endX, endY);
    }

    private isWithinBoardBounds(x: number, y: number): boolean {
        return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
    }

    setBoard(newBoard: Board): void {
        this.board = newBoard;
    }

    setShips(newShips: Ship[]): void {
        this.ships = newShips;
    }

    setDraggingShip(shipId: number | null): void {
        this.draggingShipId = shipId;
    }

    populatePortWithShips(): void {
        this.ships = SHIP_SIZES.map((size, index) => new Ship(index, size));
    }

    placeShip(id: number, position: Position): void {
        const ship = this.getShipById(id);
        if (ship && this.canPlaceShip(this.board, ship.size, position.x, position.y, ship.direction)) {
            this.removeShipFromBoard(ship);
            this.setBoard(this.placeShipOnBoard(this.board, ship, position.x, position.y));
            ship.setPosition(position.x, position.y);
        }
    }

    returnShipToPort(shipId: number): void {
        const ship = this.getShipById(shipId);
        if (ship) {
            this.removeShipFromBoard(ship);
            ship.setPosition(null, null);
        }
    }

    moveShip(shipId: number, x: number, y: number): void {
        const ship = this.getShipById(shipId);
        if (!ship) return;

        if (this.canPlaceShip(this.board, ship.size, x, y, ship.direction)) {
            this.removeShipFromBoard(ship);
            this.setBoard(this.placeShipOnBoard(this.board, ship, x, y));
            ship.setPosition(x, y);
        } else {
            this.returnShipToPort(shipId);
        }
    }

    removeShipFromBoard(ship: Ship): void {
        this.board = this.board.map(row => row.map(cell =>
            cell.ship?.id === ship.id ? { ...cell, ship: null, status: 'water' } : cell
        ));
    }

    handleRandomShipsPlacement(): void {
        const placement = this.randomShipsPlacement();
        if (placement) {
            this.board = placement.board;
            this.ships = placement.ships;
        }
    }

    randomShipsPlacement(): { board: Board, ships: Ship[] } | null {
        const newBoard = createEmptyBoard();
        const ships: Ship[] = [];
        const maxAttempts = 100;

        for (let i = 0; i < SHIP_SIZES.length; i++) {
            const size = SHIP_SIZES[i];
            const ship = this.tryPlaceShipRandomly(newBoard, size, i, maxAttempts);
            if (!ship) return null;
            ships.push(ship);
        }

        return { board: newBoard, ships };
    }

    private tryPlaceShipRandomly(board: Board, size: number, id: number, maxAttempts: number): Ship | null {
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            const x = getRandomInt(0, BOARD_SIZE - 1);
            const y = getRandomInt(0, BOARD_SIZE - 1);
            const direction = DIRECTIONS[getRandomInt(0, DIRECTIONS.length - 1)];

            if (this.canPlaceShip(board, size, x, y, direction)) {
                const ship = new Ship(id, size);
                ship.setPosition(x, y);
                ship.setDirection(direction);
                this.placeShipOnBoard(board, ship, x, y);
                return ship;
            }
        }
        return null;
    }

    canPlaceShip(board: Board, size: number, x: number, y: number, direction: Direction): boolean {
        for (let i = 0; i < size; i++) {
            const newX = x + i * direction[0];
            const newY = y + i * direction[1];
            if (!this.isValidCell(board, newX, newY)) {
                return false;
            }
        }
        return true;
    }

    private isValidCell(board: Board, x: number, y: number): boolean {
        return x >= 0 && x < BOARD_SIZE &&
            y >= 0 && y < BOARD_SIZE &&
            board[x][y].ship === null &&
            isCellFree(board, x, y);
    }

    placeShipOnBoard(board: Board, ship: Ship, x: number, y: number): Board {
        return board.map((row, rowIndex) =>
            row.map((cell, cellIndex) => {
                if (this.isCellPartOfShip(rowIndex, cellIndex, x, y, ship)) {
                    return { ...cell, ship, status: 'ship' };
                }
                return cell;
            })
        );
    }

    private isCellPartOfShip(rowIndex: number, cellIndex: number, shipX: number, shipY: number, ship: Ship): boolean {
        for (let i = 0; i < ship.size; i++) {
            if (rowIndex === shipX + i * ship.direction[0] && cellIndex === shipY + i * ship.direction[1]) {
                return true;
            }
        }
        return false;
    }

    // canRotateShip(shipId: number): boolean {
    //     const ship = this.getShipById(shipId);
    //     if (!ship || ship.x === null || ship.y === null) return false;

    //     const newDirection: Direction = ship.direction[0] === 0 ? [1, 0] : [0, 1];
    //     const tempBoard = this.createTempBoardWithoutShip(ship);

    //     return this.canPlaceShip(tempBoard, ship.size, ship.x, ship.y, newDirection);
    // }

    // private createTempBoardWithoutShip(ship: Ship): Board {
    //     return this.board.map(row => row.map(cell =>
    //         cell.ship?.id === ship.id ? { ...cell, ship: null, status: 'water' } : { ...cell }
    //     ));
    // }

    // rotateShip(shipId: number): void {
    //     const ship = this.getShipById(shipId);
    //     if (!ship || ship.x === null || ship.y === null) return;

    //     if (this.canRotateShip(shipId)) {
    //         this.removeShipFromBoard(ship);
    //         ship.rotate();
    //         this.setBoard(this.placeShipOnBoard(this.board, ship, ship.x, ship.y));
    //     }
    // }

    private getShipById(id: number): Ship | undefined {
        return this.ships.find(ship => ship.id === id);
    }
}

const gameStore = new GameStore();
export default gameStore;
