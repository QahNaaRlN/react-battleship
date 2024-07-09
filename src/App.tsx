import React from 'react';
import { observer } from 'mobx-react-lite';
import {
    DndContext,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    rectIntersection
} from '@dnd-kit/core';
import gameStore from "./store";
import Port from './components/Port';
import Board from './components/Board';
import './App.css';
import {TOTAL_CELL_SIZE} from "./utils/constants.ts";
import {createSnapModifier} from "@dnd-kit/modifiers";

const snapToGrid = createSnapModifier(TOTAL_CELL_SIZE);

const App: React.FC = observer(() => {
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const shipId = parseInt(active.id.toString(), 10);
        gameStore.setDraggingShip(shipId);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const shipId = parseInt(active.id.toString(), 10);
        const ship = gameStore.ships.find(s => s.id === shipId);

        // Проверяем, находится ли курсор над доской
        const isOverBoard = over && over.id.toString().startsWith('cell-');

        if (isOverBoard && ship) {
            // const rect = over.rect;
            const rect = document.querySelector('.board').getBoundingClientRect();
            const nearestCell = gameStore.calculateNearestCell(rect.left, rect.top);

            // Проверяем, полностью ли корабль находится над доской
            const isShipCompletelyOverBoard = gameStore.isShipOverBoard(ship, nearestCell);

            if (isShipCompletelyOverBoard) {
                gameStore.setHoveredCell(nearestCell.x, nearestCell.y);
                gameStore.setIsOverBoard(true);

                const offsetX = (ship.direction[0] === 1 ? ship.size - 1 : 0) / 2;
                const offsetY = (ship.direction[1] === 1 ? ship.size - 1 : 0) / 2;
                const snapX = (nearestCell.x - offsetX) * TOTAL_CELL_SIZE;
                const snapY = (nearestCell.y - offsetY) * TOTAL_CELL_SIZE;

                if (event.activatorEvent && event.activatorEvent.target instanceof HTMLElement) {
                    event.activatorEvent.target.style.transform = `translate3d(${snapX}px, ${snapY}px, 0)`;
                }
            } else {
                resetDragState(event);
            }
        } else {
            resetDragState(event);
        }
    };

    const resetDragState = (event: DragOverEvent) => {
        gameStore.setHoveredCell(null, null);
        gameStore.setIsOverBoard(false);

        if (event.activatorEvent && event.activatorEvent.target instanceof HTMLElement) {
            event.activatorEvent.target.style.transform = '';
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const shipId = parseInt(active.id.toString(), 10);

        if (over && over.id.toString().startsWith('cell-')) {
            const [, x, y] = over.id.toString().split('-');
            gameStore.moveShip(shipId, parseInt(x), parseInt(y));
        } else {
            gameStore.returnShipToPort(shipId);
        }

        gameStore.setHoveredCell(null, null);
        gameStore.setDraggingShip(null);
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} collisionDetection={rectIntersection} modifiers={[snapToGrid]}>
            <div className="app">
                <Port />
                <Board />
            </div>
        </DndContext>
    );
});

export default App;
