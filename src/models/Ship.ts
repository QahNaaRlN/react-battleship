import {makeAutoObservable} from 'mobx';

class Ship {
    id: number;
    size: number;
    direction: [number, number];
    x: number | null;
    y: number | null;
    isDragging: boolean = false;
    tempX: number | null = null;
    tempY: number | null = null;

    constructor(id: number, size: number) {
        this.id = id;
        this.size = size;
        this.direction = [0, 1];
        this.x = null;
        this.y = null;
        makeAutoObservable(this);
    }

    setDragging(dragging: boolean) {
        this.isDragging = dragging;
    }

    setPosition(x: number | null, y: number | null) {
        this.x = x;
        this.y = y;
        this.tempX = null;
        this.tempY = null;
    }

    setTempPosition(x: number | null, y: number | null) {
        this.tempX = x;
        this.tempY = y;
    }

    rotate() {
        this.direction = this.direction[0] === 0 ? [1, 0] : [0, 1];
    }
}

export default Ship;
