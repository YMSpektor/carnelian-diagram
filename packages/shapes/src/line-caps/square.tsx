/** @jsxImportSource @carnelian-diagram/core */

import { LineCapComponent } from ".";

export const Square: LineCapComponent = function(props) {
    const styleProps = {
        ...props.style,
        strokeDasharray: null,
        fill: props.style?.stroke || "initial"
    };

    return (
        <rect x={props.x - props.size} y={props.y - props.size / 2} width={props.size} height={props.size} style={{...styleProps}} />
    );
}