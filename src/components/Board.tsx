import React from 'react';
import { observer } from "mobx-react-lite";
import gameStore from "../store";
import Cell from './Cell';

const Board: React.FC = observer(() => {
    return (
        <div className='board'>
            {gameStore.board.map((row, x) => (
                <div key={x} className='row'>
                    {row.map((cell, y) => (
                        <Cell
                            key={`${x}-${y}`}
                            x={x}
                            y={y}
                            ship={cell.ship}
                            status={cell.status}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

export default Board;
