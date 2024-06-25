import Ship from "./models/Ship.ts";
import React from "react";

export interface CellProps {
    ship: Ship | null;
    status: 'water' | 'ship' | 'hit' | 'miss' | 'buffer';
    x: number;
    y: number;
}

export interface DraggableShipProps {
    ship: Ship;
}

export interface ShipCellProps {
    ship: Ship;
    isRotatable?: boolean;
    onRotate?: (e: React.MouseEvent) => void;
    isOnBoard: boolean;
}

export type Board = CellProps[][];

export type Direction = [number, number][];
