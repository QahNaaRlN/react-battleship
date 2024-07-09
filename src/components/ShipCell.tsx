import React from "react";
import {ShipCellProps} from "../types.ts";


const ShipCell: React.FC<ShipCellProps> = ({ship, onRotate}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRotate) {
            onRotate(e);
        }
    };

    return (
        <span
            className=''
            onClick={handleClick}
            style={{
                transform: `rotate(${ship.direction[0] === 1 ? '90deg' : '0deg'})`,
                display: 'inline-block',
                transition: 'transform 0.3s',
                width: '100%',
                height: '100%',
            }}
        ></span>
    );
};

export default ShipCell;
