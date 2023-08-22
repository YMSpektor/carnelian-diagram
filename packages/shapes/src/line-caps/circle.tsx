/** @jsxImportSource @carnelian-diagram/core */

import { LineCapComponent } from ".";

export const Circle: LineCapComponent = function(props) {
    const styleProps = {
        ...props.style,
        strokeDasharray: null,
        fill: props.style?.stroke || "initial"
    };

    return (
        <circle cx={props.x - props.size / 2} cy={props.y} r={props.size / 2} style={{...styleProps}} />
    );
}