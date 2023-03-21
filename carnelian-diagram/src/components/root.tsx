/** @jsxImportSource .. */
import { schedule } from "../utils/schedule";
import { DiagramElementNode, useEffect, useState } from "..";
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
                controller.init(newMatrix);
                setMatrix(newMatrix);
            }

            cancelSchedule = schedule(workloop);
        }

        cancelSchedule = schedule(workloop);

        return () => {
            cancelSchedule();
        }
    }, []);

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
