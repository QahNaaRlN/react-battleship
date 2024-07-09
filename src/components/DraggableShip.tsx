import { useDraggable } from "@dnd-kit/core";
import {DraggableShipProps} from "../types";
import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import ShipCell from "./ShipCell.tsx";
import gameStore from "../store.ts";
import {TOTAL_CELL_SIZE} from "../utils/constants.ts";
import {createSnapModifier} from "@dnd-kit/modifiers";

const snapToGrid = createSnapModifier(TOTAL_CELL_SIZE);

export const DraggableShip: React.FC<DraggableShipProps> = observer(({ ship }) => {
    const [cannotRotate, setCannotRotate] = useState(false);

    const isOverBoard = gameStore.isOverBoard;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: ship.id.toString(),
        modifiers: isOverBoard ? [snapToGrid] : [],
    });

    const isOverValidCell = gameStore.isShipOverValidCell(ship.id);

    const handleRotate = () => {
        if (gameStore.isOverBoard && gameStore.canRotateShip(ship.id)) {
            gameStore.rotateShip(ship.id);
            setCannotRotate(false);
        } else {
            setCannotRotate(true);
            setTimeout(() => setCannotRotate(false), 2000);
        }
    };

    useEffect(() => {
        console.log(cannotRotate)
    }, [cannotRotate]);

    const style = {
        width: 'fit-content',
        height: `${TOTAL_CELL_SIZE}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${ship.size}, ${TOTAL_CELL_SIZE}px)`,
        gridTemplateRows: `${TOTAL_CELL_SIZE}px`,
        animation: cannotRotate ? 'shake 0.5s' : 'none',
        backgroundColor: 'gray',
        zIndex: gameStore.draggingShipId === ship.id ? 10000 : 1000,
        cursor: 'move',
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        border: isDragging
            ? (isOverValidCell ? '1px solid green' : '1px solid red')
            : '1px solid black',
        opacity: isDragging ? 1 : 0.6,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    };

    return (
        <div
            ref={setNodeRef}
            className={`draggable-ship size-${ship.size}`}
            style={{
                ...style,
                transform: isOverBoard ? style.transform : transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            }}
            {...attributes}
            {...listeners}
        >
            {Array.from({length: ship.size}).map((_, index) => (
                <ShipCell
                    key={index}
                    ship={ship}
                    onRotate={handleRotate}
                />
            ))}
        </div>
    );
});
