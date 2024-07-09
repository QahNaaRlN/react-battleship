import Ship from "./models/Ship";
import React from "react";

export type CellStatus = 'water' | 'ship' | 'hit' | 'miss' | 'buffer';

export interface Position {
    x: number;
    y: number;
}

export interface CellProps extends Position {
    ship: Ship | null;
    status: CellStatus;
}

export interface DraggableShipProps {
    ship: Ship;
}

export interface ShipCellProps {
    ship: Ship;
    onRotate?: (e: React.MouseEvent) => void;
}

export type Board = CellProps[][];

export type Direction = [number, number];
