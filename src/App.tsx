import React from 'react';
import { observer } from 'mobx-react-lite';
import { DndContext } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core';
import gameStore from "./store.ts";
import Port from './components/Port';
import Board from './components/Board';
import './App.css';

const App: React.FC = observer(() => {

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id.toString().startsWith('cell-')) {
            const [, x, y] = over.id.toString().split('-');
            gameStore.moveShip(parseInt(active.id.toString()), parseInt(x), parseInt(y));
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="app">
                <Port />
                <Board />
            </div>
        </DndContext>
    );
});

export default App;
