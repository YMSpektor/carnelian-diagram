/** @jsxImportSource .. */
import { DiagramElementNode, DiagramRootProps, useContext, useEffect, useState } from "..";
import {
    InteractionContext, 
    InteractionController,
    SelectionContext
} from ".";
import { scheduleIdle } from "../utils/schedule";
import { Rect } from "../geometry";

const DiagramElements = (props: { elements: DiagramElementNode[] }) => {
    return (
        <g>
            {props.elements}
        </g>
    );
}

interface DiagramControlsProps {
    matrix: DOMMatrixReadOnly | undefined;
}

const DiagramControls = (props: DiagramControlsProps) => {
    const matrix = props.matrix;
    const controller = useContext(InteractionContext);

    const [rectSelection, setRectSelection] = useState<Rect | undefined>(undefined);
    controller && (controller.onRectSelection = (rect) => setRectSelection(rect));

    const transform = matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;

    return (
        matrix && <g transform={transform}>
            {controller?.renderControls(matrix.inverse())}
            {rectSelection && <rect {...rectSelection} fill="none" stroke="black" stroke-dasharray="4" />}
        </g>
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
