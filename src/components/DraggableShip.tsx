import { useDraggable } from "@dnd-kit/core";
import {DraggableShipProps} from "../types";
import React, { useState } from "react";
import {observer} from "mobx-react-lite";
import ShipCell from "./ShipCell.tsx";
import gameStore from "../store.ts";
import {CELL_SIZE} from "../utils/constants.ts";

export const DraggableShip: React.FC<DraggableShipProps> = observer(({ ship }) => {
    const [cannotRotate, setCannotRotate] = useState(false);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: ship.id.toString(),
    });

    const isOverValidCell = gameStore.isShipOverValidCell(ship.id);

    const handleRotate = () => {
        if (gameStore.canRotateShip(ship.id)) {
            gameStore.rotateShip(ship.id);
        } else {
            setCannotRotate(true);
            setTimeout(() => setCannotRotate(false), 500);
        }
    };

    const style = {
        width: 'fit-content',
        height: '32px',
        display: 'grid',
        gridTemplateColumns: `repeat(${ship.size}, ${CELL_SIZE}px)`,
        gridTemplateRows: `${CELL_SIZE}px`,
        animation: cannotRotate ? 'shake 0.5s' : 'none',
        backgroundColor: 'gray',
        zIndex: gameStore.draggingShipId === ship.id ? 10000 : 1000,
        cursor: 'move',
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        border: isDragging
            ? (isOverValidCell ? '2px solid green' : '2px solid red')
            : '2px solid transparent',
        opacity: isDragging ? 1 : 0.6,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    };

    return (
        <div
            ref={setNodeRef}
            className={`draggable-ship size-${ship.size}`}
            style={style}
            {...attributes}
            {...listeners}
        >
            {Array.from({length: ship.size}).map((_, index) => (
                <ShipCell
                    key={index}
                    ship={ship}
                    isOnBoard={false}
                    onRotate={handleRotate}
                />
            ))}
        </div>
    );
});
