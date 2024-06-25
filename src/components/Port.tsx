import React from 'react';
import { DraggableShip } from "./DraggableShip.tsx";
import {observer} from "mobx-react-lite";
import gameStore from "../store.ts";

const Port: React.FC = observer(() => {
    const unplacedShips = gameStore.ships.filter(ship => ship.x === null || ship.y === null);

    return (
        <div className="port">
            {unplacedShips.length > 0 ? (
                unplacedShips.map((ship) => <DraggableShip key={ship.id} ship={ship}/>)
            ) : (
                <p>Все корабли размещены!</p>
            )}
        </div>
    );
})

export default Port;
