import React from 'react';
import { CellProps } from '../types';
import {observer} from "mobx-react-lite";
import {useDroppable} from "@dnd-kit/core";
import gameStore from "../store.ts";
import ShipCell from "./ShipCell.tsx";

const Cell: React.FC<CellProps> = observer(({ ship, status, x, y }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `cell-${x}-${y}`,
    });

    const handleRotate = () => {
        if (ship) {
            gameStore.rotateShip(ship.id);
        }
    };

    const getCellStyle = (status: CellProps['status']) => {
        switch (status) {
            case 'water':
                return 'cell-water';
            case 'ship':
                return 'cell-ship';
            case 'hit':
                return 'cell-hit';
            case 'miss':
                return 'cell-miss';
            case 'buffer':
                return 'cell-buffer';
            default:
                return '';
        }
    };

    const cellStyle = getCellStyle(status);

    return (
        <div
            ref={setNodeRef}
            className={`cell ${cellStyle} ${isOver ? 'drag-over' : ''}`}
            aria-label={`Cell ${x},${y}, status: ${status}`}
            role='gridcell'
            onClick={handleRotate}
        >
            {status === 'hit' && <span>🔥</span>}
            {status === 'miss' && <span>💦</span>}
            {ship && status === 'ship' && (
                <ShipCell
                    ship={ship}
                    isOnBoard={true}
                    onRotate={handleRotate}
                />
            )}
        </div>
    );
});

export default Cell;
