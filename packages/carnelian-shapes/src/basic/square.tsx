/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";;
import { withInteractiveSquare } from "@carnelian/interaction";
import { SquareBaseProps } from ".";

export interface SquareProps extends SquareBaseProps { }

export const Square: DiagramElement<SquareProps> = function(props) {
    let { onChange, x, y, size, ...rest } = props;

    return (
        <rect x={x} y={y} width={size} height={size} {...rest} />
    );
};

export const InteractiveSquare = withInteractiveSquare(Square);