import { makeAutoObservable } from 'mobx';

class Ship {
    id: number;
    size: number;
    direction: [number, number];
    x: number | null;
    y: number | null;

    constructor(id: number, size: number) {
        this.id = id;
        this.size = size;
        this.direction = [0, 1];
        this.x = null;
        this.y = null;
        makeAutoObservable(this);
    }

    rotate?() {
        this.direction = this.direction[0] === 0 ? [1, 0] : [0, 1];
    }

    setPosition?(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default Ship;
