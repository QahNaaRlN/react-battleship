import React from 'react';
import { observer } from 'mobx-react-lite';
import gameStore from "./store";
import Port from './components/Port';
import Board from './components/Board';
import './App.css';
import {TOTAL_CELL_SIZE} from "./utils/constants.ts";


const App: React.FC = observer(() => {


    return (
        <div className="app">
            <Port />
            <Board />
        </div>
    );
});

export default App;
