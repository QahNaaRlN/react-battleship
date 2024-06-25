import { useDraggable } from "@dnd-kit/core";
import {DraggableShipProps} from "../types";
import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import ShipCell from "./ShipCell.tsx";
import gameStore from "../store.ts";
import {CELL_SIZE} from "../utils/constants.ts";

export const DraggableShip: React.FC<DraggableShipProps> = observer(({ ship }) => {
    // const [isSnapped, setIsSnapped] = useState(false);
    // const [cannotRotate, setCannotRotate] = useState(false);


    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: ship.id.toString(),
    });

    // const snapToGrid = (x: number, y: number) => {
    //     const boardOffset = 0; // Добавьте смещение, если доска не начинается с (0,0)
    //     return {
    //         x: Math.round((x - boardOffset) / CELL_SIZE) * CELL_SIZE + boardOffset,
    //         y: Math.round((y - boardOffset) / CELL_SIZE) * CELL_SIZE + boardOffset
    //     };
    // };
    //
    // const snappedPosition = snapToGrid(transform?.x ?? 0, transform?.y ?? 0);

    const style = {
        transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
        // transform: `translate3d(${snappedPosition.x}px, ${snappedPosition.y}px, 0)`,
        width: 'fit-content',
        display: 'grid',
        gridTemplateColumns: `repeat(${ship.size}, 32px)`,
        gridTemplateRows: '32px',
        // border: isSnapped ? '1px solid green' : '1px solid black',
        // animation: cannotRotate ? 'shake 0.5s' : 'none',
        backgroundColor: 'gray',
        zIndex: 1000,
    };

    // const handleRotate = () => {
    //     if (gameStore.canRotateShip(ship.id)) {
    //         gameStore.rotateShip(ship.id);
    //     } else {
    //         setCannotRotate(true);
    //         setTimeout(() => setCannotRotate(false), 500);
    //     }
    // };
    //
    // useEffect(() => {
    //     if (transform) {
    //         const { x, y } = snapToGrid(transform.x, transform.y);
    //         const boardX = Math.floor(x / CELL_SIZE);
    //         const boardY = Math.floor(y / CELL_SIZE);
    //         const canPlace = gameStore.canPlaceShip(gameStore.board, ship.size, boardX, boardY, ship.direction);
    //         setIsSnapped(canPlace);
    //
    //         if (canPlace) {
    //             ship.setPosition?.(boardX, boardY);
    //         }
    //     }
    // }, [transform, ship]);

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
                    // isOnBoard={false}
                    // onRotate={handleRotate}
                />
            ))}
        </div>
    );
});
