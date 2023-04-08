/** @jsxImportSource @carnelian/diagram */

import { DiagramElementNode, DiagramRootComponent, DiagramRootProps, useEffect, useState } from "@carnelian/diagram";
import {
    ControlsContext,
    InteractionContext, 
    InteractionController, 
    PaperChangeEventArgs, 
    PaperOptions, 
    RectSelectionEventArgs, 
    SelectEventArgs, 
    SelectionContext
} from "..";
import { scheduleIdle } from "@carnelian/diagram/utils/schedule";
import { JSX } from "@carnelian/diagram/jsx-runtime";
import { Rect } from "../geometry";

function DiagramPaper(props: PaperOptions) {
    return (
        <g className="paper-container">
            <rect className="paper" {...props} />
        </g>
    )
}

function DiagramElements<P>(props: { children: JSX.Element, rootProps: P }) {
    return (
        <g {...props.rootProps}>
            {props.children}
        </g>
    );
}

interface DiagramControlsProps {
    matrix: DOMMatrixReadOnly | undefined;
    controller: InteractionController;
}

function DiagramControls(props: DiagramControlsProps) {
    const { matrix, controller } = props;
    const [rectSelection, setRectSelection] = useState<Rect | null>(null);

    const handleRectSelection = (e: RectSelectionEventArgs) => setRectSelection(e.selectionRect);

    useEffect(() => {
        controller.onRectSelection.addListener(handleRectSelection);
        return () => {
            controller.onRectSelection.removeListener(handleRectSelection);
        }
    }, [controller]);

    const transform = matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;

    return (
        <ControlsContext.Provider value={controller.controlsContext}>
            {matrix && <g transform={transform}>
                {controller.renderControls(matrix.inverse())}
                {rectSelection && <rect className="selection-rect" {...rectSelection} fill="none" stroke="black" stroke-dasharray="4" />}
            </g>}
        </ControlsContext.Provider>
    );
}

export interface InteractiveRootOptions<P> {
    elementsRootProps?: P;
}

export function withInteractiveRoot<P>( 
    WrappedComponent: DiagramRootComponent,
    controller: InteractionController,
    options?: InteractiveRootOptions<P>
): DiagramRootComponent {
    return (props: DiagramRootProps) => {
        const [matrix, setMatrix] = useState<DOMMatrix | undefined>(undefined);
        const [selectedElements, setSelectedElements] = useState<DiagramElementNode[]>([]);
        const [paper, setPaper] = useState(controller.getPaperOptions());

        controller.elements = props.children;

        const handleSelect = (e: SelectEventArgs) => setSelectedElements(e.selectedElements);
        const handlePaperChange = (e: PaperChangeEventArgs) => setPaper(e.paper);
        const calcMatrix = () => props.svg.getCTM?.()?.inverse();

        useEffect(() => {
            controller.onSelect.addListener(handleSelect);
            controller.onPaperChange.addListener(handlePaperChange);

            return () => {
                controller.onSelect.removeListener(handleSelect);
                controller.onPaperChange.removeListener(handlePaperChange);
            }
        }, [controller]);

        useEffect(() => {
            let cancelSchedule: () => void;
            let curMatrix = matrix;

            const workloop = () => {
                const newMatrix = calcMatrix() || undefined;
                if ((newMatrix && !curMatrix) || 
                    (curMatrix && !newMatrix) || 
                    (newMatrix && curMatrix && (newMatrix.a !== curMatrix.a || newMatrix.b !== curMatrix.b || newMatrix.c !== curMatrix.c || newMatrix.d !== curMatrix.d || newMatrix.e !== curMatrix.e || newMatrix.f !== curMatrix.f)))
                {
                    curMatrix = newMatrix;
                    controller.transform = newMatrix;
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
            <InteractionContext.Provider value={controller.interactionContext}>
                <SelectionContext.Provider value={selectedElements}>
                    {paper && <DiagramPaper {...paper} />}
                    <DiagramElements rootProps={options?.elementsRootProps}>
                        <WrappedComponent {...props} />
                    </DiagramElements>
                    <DiagramControls matrix={calcMatrix()} controller={controller} />
                </SelectionContext.Provider>
            </InteractionContext.Provider>
        )
    }
}