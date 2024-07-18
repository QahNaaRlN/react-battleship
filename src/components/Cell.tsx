import React from 'react';
import { CellProps } from '../types';
import {observer} from "mobx-react-lite";
import ShipCell from "./ShipCell.tsx";

const Cell: React.FC<CellProps> = observer(({ ship, status, x, y }) => {

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
            className={`cell ${cellStyle}`}
            aria-label={`Cell ${x},${y}, status: ${status}`}
            role='gridcell'
        >
            {status === 'hit' && <span>🔥</span>}
            {status === 'miss' && <span>💦</span>}
            {ship && status === 'ship' && (
                <ShipCell
                    ship={ship}
                />
            )}
        </div>
    );
});

export default Cell;
