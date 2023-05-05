/** @jsxImportSource @carnelian/diagram */

import { useState } from "@carnelian/diagram";
import { withInteractiveRect } from "@carnelian/interaction";

export interface CustomElementProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const CustomElement = function(props: CustomElementProps) {
    const { x, y, width, height } = props;

    const [color, setColor] = useState("red");
    setTimeout(() => {
        setColor(color === "red" ? "yellow" : "red");
    }, 1000);

    return (
        <rect x={x} y={y} width={width} height={height} fill={color} />
    ); 
}

export const InteractiveCustomElement = withInteractiveRect(CustomElement);