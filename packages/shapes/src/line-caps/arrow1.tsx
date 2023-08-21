/** @jsxImportSource @carnelian-diagram/core */

import { LineCapComponent } from ".";

export const Arrow1: LineCapComponent = function(props) {
    const points = [
        {x: props.x - props.size, y: props.y - props.size / 2},
        {x: props.x, y: props.y},
        {x: props.x - props.size, y: props.y + props.size / 2}
    ];

    const styleProps = {
        ...props.style,
        fill: "none"
    };

    return (
        <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} style={{...styleProps}} />
    );
}