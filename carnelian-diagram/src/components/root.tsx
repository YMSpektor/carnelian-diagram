/** @jsxImportSource .. */
import { DiagramElementNode, useIdleEffect, useState } from "..";
import {
    InteractionContext, 
    InteractionController
} from "../interactivity";

export interface RootProps {
    svg: SVGGraphicsElement;
    children: DiagramElementNode[];
}

export function Root(props: RootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | undefined>(undefined);
    const [controller] = useState(new InteractionController(props.svg));
    const [selectedElements, setSelectedElements] = useState<DiagramElementNode[]>([]);

    controller.onSelect = (elements) => setSelectedElements(elements);

    useIdleEffect(() => {
        const newMatrix = props.svg.getScreenCTM?.()?.inverse() || undefined;
        if ((newMatrix && !matrix) || 
            (matrix && !newMatrix) || 
            (newMatrix && matrix && (newMatrix.a !== matrix.a || newMatrix.b !== matrix.b || newMatrix.c !== matrix.c || newMatrix.d !== matrix.d || newMatrix.e !== matrix.e || newMatrix.f !== matrix.f)))
        {
            controller.init(newMatrix);
            setMatrix(newMatrix);
        }
    }); 

    const DiagramElements = (props: { elements: DiagramElementNode[] }) => {
        return (
            <g>
                {props.elements}
            </g>
        );
    }

    const DiagramControls = (props: { matrix: DOMMatrixReadOnly | undefined }) => {
        const transform = matrix 
            ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
            : undefined;

        return (
            props.matrix ? <g transform={transform}>
                {controller.renderControls(props.matrix.inverse())}
            </g> : undefined
        );
    }

    return (
        <InteractionContext.Provider value={controller}>
            <DiagramElements elements={props.children} />
            <DiagramControls matrix={matrix} />
        </InteractionContext.Provider>
    )
}
