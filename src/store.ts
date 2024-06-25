import {makeAutoObservable} from 'mobx';
import { Board } from './types';
import Ship from './models/Ship'
import {createEmptyBoard, getRandomInt, isCellFree} from './utils/logic';
import {directions, SHIP_SIZES} from './utils/constants';

class GameStore {
    board: Board = createEmptyBoard();
    ships: Ship[] = [];

    constructor() {
        makeAutoObservable(this);
        this.populatePortWithShips();
    }

    setBoard(newBoard: Board) {
        this.board = newBoard;
    }

    setShips(newShips: Ship[]) {
        this.ships = newShips;
    }

    populatePortWithShips() {
        const newShips: Ship[] = SHIP_SIZES.map((size, index) => new Ship(index, size));
        this.setShips(newShips);
    }

    get allShipsPlaced() {
        return this.ships.every(ship => ship.x !== null && ship.y !== null);
    }

    placeShip(id: number, position: { x: number; y: number }) {
        const ship = this.ships.find((ship) => ship.id === id);
        if (ship && this.canPlaceShip(this.board, ship.size, position.x, position.y, ship.direction)) {
            if (ship.x !== null && ship.y !== null) {
                this.removeShipFromBoard(ship);
            }
            this.setBoard(this.placeShipOnBoard(this.board, ship, position.x, position.y));
            ship.setPosition?.(position.x, position.y);
        }
    }

    moveShip(shipId: number, x: number, y: number) {
        const ship = this.ships.find(s => s.id === shipId);
        if (!ship) return;

        if (this.canPlaceShip(this.board, ship.size, x, y, ship.direction)) {
            if (ship.x !== null && ship.y !== null) {
                // Удаляем корабль с предыдущей позиции
                this.removeShipFromBoard(ship);
            }
            this.setBoard(this.placeShipOnBoard(this.board, ship, x, y));
            ship.setPosition?.(x, y);
        }
    }

    removeShipFromBoard(ship: Ship) {
        this.board = this.board.map(row => row.map(cell => {
            if (cell.ship?.id === ship.id) {
                return { ...cell, ship: null, status: 'water' };
            }
            return cell;
        }));
    }

    rotateShip(shipId: number) {
        const ship = this.ships.find(s => s.id === shipId);
        if (!ship || ship.x === null || ship.y === null) return;

        const newDirection: [number, number] = ship.direction[0] === 0 ? [1, 0] : [0, 1];

        this.removeShipFromBoard(ship);

        if (this.canPlaceShip(this.board, ship.size, ship.x, ship.y, newDirection)) {
            ship.rotate?.();
            this.setBoard(this.placeShipOnBoard(this.board, ship, ship.x, ship.y));
        } else {
            // Если нельзя повернуть, возвращаем на место
            this.setBoard(this.placeShipOnBoard(this.board, ship, ship.x, ship.y));
        }
    }

    handleRandomShipsPlacement() {
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
        let placedShips = 0;

        for (const size of SHIP_SIZES) {
            let attempts = 0;
            let validPlacement = false;

            while (!validPlacement && attempts < maxAttempts) {
                const x = getRandomInt(0, newBoard.length - 1);
                const y = getRandomInt(0, newBoard[0].length - 1);
                const direction = directions[getRandomInt(0, directions.length - 1)];

                if (this.canPlaceShip(newBoard, size, x, y, direction)) {
                    const newShip: Ship = { id: placedShips, size, direction, x, y };
                    this.placeShipOnBoard(newBoard, newShip, x, y);
                    ships.push(newShip);
                    placedShips++;
                    validPlacement = true;
                }
                attempts++;
            }

            if (attempts === maxAttempts) {
                return null;
            }
        }
        return { board: newBoard, ships: ships };
    }

    canPlaceShip(board: Board, size: number, x: number, y: number, direction: [number, number]): boolean {
        for (let i = 0; i < size; i++) {
            const newX = x + i * direction[0];
            const newY = y + i * direction[1];
            if (
                newX < 0 ||
                newX >= board.length ||
                newY < 0 ||
                newY >= board[0].length ||
                board[newX][newY].ship !== null ||
                !isCellFree(board, newX, newY)
            ) {
                return false;
            }
        }
        return true;
    }

    // canPlaceShip(board: Board, size: number, x: number, y: number, direction: [number, number]): boolean {
    //     // Проверяем все клетки, которые займет корабль, и буферную зону вокруг него
    //     for (let i = -1; i <= size; i++) {
    //         for (let j = -1; j <= 1; j++) {
    //             const newX = x + i * direction[0] + j * (1 - direction[0]);
    //             const newY = y + i * direction[1] + j * (1 - direction[1]);
    //
    //             // Проверка на выход за границы доски
    //             if (newX >= 0 && newX < board.length && newY >= 0 && newY < board[0].length) {
    //                 // Если это клетка корабля (не буферная зона)
    //                 if (i >= 0 && i < size && j === 0) {
    //                     if (board[newX][newY].ship !== null) {
    //                         return false;
    //                     }
    //                 } else {
    //                     // Если это буферная зона
    //                     if (!isCellFree(board, newX, newY)) {
    //                         return false;
    //                     }
    //                 }
    //             } else if (i >= 0 && i < size && j === 0) {
    //                 // Если клетка корабля выходит за границы доски
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }

    placeShipOnBoard(board: Board, ship: Ship, x: number, y: number): Board {
        const newBoard = [...board];
        for (let i = 0; i < ship.size; i++) {
            const newX = x + i * ship.direction[0];
            const newY = y + i * ship.direction[1];
            newBoard[newX][newY].ship = ship;
            newBoard[newX][newY].status = 'ship';
        }
        return newBoard;
    }

    canRotateShip(shipId: number): boolean {
        const ship = this.ships.find(s => s.id === shipId);
        if (!ship || ship.x === null || ship.y === null) return false;

        const newDirection: [number, number] = ship.direction[0] === 0 ? [1, 0] : [0, 1];
        return this.canPlaceShip(this.board, ship.size, ship.x, ship.y, newDirection);
    }
}

const gameStore = new GameStore();
export default gameStore;
