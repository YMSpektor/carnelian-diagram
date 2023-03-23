/** @jsxImportSource .. */
import { scheduleIdle } from "../utils/schedule";
import { DiagramElementNode, DiagramRootProps, useEffect, useState } from "..";
import {
    InteractionContext, 
    InteractionController,
    SelectionContext
} from ".";

const DiagramElements = (props: { elements: DiagramElementNode[] }) => {
    return (
        <g>
            {props.elements}
        </g>
    );
}

const DiagramControls = (props: { matrix: DOMMatrixReadOnly | undefined }) => {
    const matrix = props.matrix;

    const transform = matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;

    return (
        <InteractionContext.Consumer>
            {(controller) => (matrix && <g transform={transform}>
                {controller?.renderControls(matrix.inverse())}
            </g>)}
        </InteractionContext.Consumer>
    );
}

export function InteractiveDiagramRoot(props: DiagramRootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | undefined>(undefined);
    const [controller] = useState(new InteractionController(props.svg));
    const [selectedElements, setSelectedElements] = useState<DiagramElementNode[]>([]);

    controller.elements = props.children;
    controller.onSelect = (elements) => setSelectedElements(elements);

    useEffect(() => {
        let cancelSchedule: () => void;
        let curMatrix = matrix;

        const workloop = () => {
            const newMatrix = props.svg.getScreenCTM?.()?.inverse() || undefined;
            if ((newMatrix && !curMatrix) || 
                (curMatrix && !newMatrix) || 
                (newMatrix && curMatrix && (newMatrix.a !== curMatrix.a || newMatrix.b !== curMatrix.b || newMatrix.c !== curMatrix.c || newMatrix.d !== curMatrix.d || newMatrix.e !== curMatrix.e || newMatrix.f !== curMatrix.f)))
            {
                curMatrix = newMatrix;
                controller.updateTransform(newMatrix);
                setMatrix(newMatrix);
            }

            cancelSchedule = scheduleIdle(workloop);
        }

        cancelSchedule = scheduleIdle(workloop);

        return () => {
            cancelSchedule();
        }
    }, []);

    return (
        <InteractionContext.Provider value={controller}>
            <SelectionContext.Provider value={selectedElements}>
                <DiagramElements elements={props.children} />
                <DiagramControls matrix={matrix} />
            </SelectionContext.Provider>
        </InteractionContext.Provider>
    )
}
