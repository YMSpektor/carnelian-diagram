/** @jsxImportSource .. */
import { DiagramComponentData, useIdleEffect, useState } from "..";
import { VirtualNode } from "../jsx-runtime";

export interface RootProps {
    svg: SVGGraphicsElement;
    children: VirtualNode<any, DiagramComponentData>[];
}

export function Root(props: RootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | null>(null);

    useIdleEffect(() => {
        const newMatrix = props.svg.getScreenCTM?.()?.inverse() || null;
        if ((newMatrix && !matrix) || 
            (matrix && !newMatrix) || 
            (newMatrix && matrix && (newMatrix.a !== matrix.a || newMatrix.b !== matrix.b || newMatrix.c !== matrix.c || newMatrix.d !== matrix.d || newMatrix.e !== matrix.e || newMatrix.f !== matrix.f)))
        {
            setMatrix(newMatrix);
        }
    });

    const transform = matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;
    return (
        <>
            <g>
                {props.children}
            </g>
            {matrix && <g transform={transform}>
                { props.children.map(node => node.data?.renderControlsCallback && node.data.renderControlsCallback(matrix.inverse())) }
            </g>}
        </>
    )
}