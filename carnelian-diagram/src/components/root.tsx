/** @jsxImportSource .. */
import { DiagramInteractions } from "../interactivity";
import { DiagramNode, useIdleEffect, useState } from "..";

export interface RootProps {
    svg: SVGGraphicsElement;
    children: DiagramNode[];
}

export function Root(props: RootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | null>(null);
    const [interactions] = useState(new DiagramInteractions());

    interactions.reset();
    DiagramInteractions.current = interactions; // TODO: use Context

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

    const DiagramControls = (props: { transform: DOMMatrixReadOnly }): JSX.Element => {
        return interactions.controls.render(props.transform.inverse());
    }

    return (
        <>
            <g>
                {props.children}
            </g>
            {matrix && <g transform={transform}>
                <DiagramControls transform={matrix} />
            </g>}
        </>
    )
}