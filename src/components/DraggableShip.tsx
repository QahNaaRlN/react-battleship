import {DraggableShipProps} from "../types";
import React from "react";
import {observer} from "mobx-react-lite";
import ShipCell from "./ShipCell.tsx";
import gameStore from "../store.ts";
import {TOTAL_CELL_SIZE} from "../utils/constants.ts";


export const DraggableShip: React.FC<DraggableShipProps> = observer(({ ship }) => {

    const style = {
        width: 'fit-content',
        height: `${TOTAL_CELL_SIZE}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${ship.size}, ${TOTAL_CELL_SIZE}px)`,
        gridTemplateRows: `${TOTAL_CELL_SIZE}px`,
        backgroundColor: 'gray',
        zIndex: gameStore.draggingShipId === ship.id ? 10000 : 1000,
        cursor: 'move',
    };

    return (
        <div
            className={`draggable-ship size-${ship.size}`}
            style={{
                ...style
            }}
        >
            {Array.from({length: ship.size}).map((_, index) => (
                <ShipCell
                    key={index}
                    ship={ship}
                />
            ))}
        </div>
    );
});
