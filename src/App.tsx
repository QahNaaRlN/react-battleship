import React from 'react';
import { observer } from 'mobx-react-lite';
import {
    DndContext,
    DragStartEvent,
    DragOverEvent,
    // DragEndEvent,
    rectIntersection,
} from '@dnd-kit/core';
import gameStore from "./store";
import Port from './components/Port';
import Board from './components/Board';
import './App.css';
// import {CELL_SIZE} from "./utils/constants.ts";

const App: React.FC = observer(() => {
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const shipId = parseInt(active.id.toString(), 10);
        gameStore.setDraggingShip(shipId);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (over && over.id.toString().startsWith('cell-')) {
            const [, x, y] = over.id.toString().split('-');
            gameStore.moveShip(parseInt(active.id.toString()), parseInt(x), parseInt(y));
        } else {
            gameStore.returnShipToPort(parseInt(active.id.toString(), 10));
        }
        gameStore.setHoveredCell(null, null);
        gameStore.setDraggingShip(null);
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} collisionDetection={rectIntersection}>
            <div className="app">
                <Port />
                <Board />
            </div>
        </DndContext>
    );
});

export default App;
