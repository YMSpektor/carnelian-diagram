/** @jsxImportSource @carnelian/diagram */

import { DiagramElementNode, DiagramRootComponent, DiagramRootProps, useEffect, useState } from "@carnelian/diagram";
import {
    ControlsContext,
    InteractionContext, 
    InteractionController, 
    RectSelectionEventArgs, 
    SelectEventArgs, 
    SelectionContext
} from "..";
import { scheduleIdle } from "@carnelian/diagram/utils/schedule";
import { JSX } from "@carnelian/diagram/jsx-runtime";
import { Rect } from "../geometry";

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

export function withInteractiveRoot<P>( 
    WrappedComponent: DiagramRootComponent,
    controller: InteractionController,
    diagramElementRootProps?: P
): DiagramRootComponent {
    return (props: DiagramRootProps) => {
        const [matrix, setMatrix] = useState<DOMMatrix | undefined>(undefined);
        const [selectedElements, setSelectedElements] = useState<DiagramElementNode[]>([]);

        controller.elements = props.children;

        const handleSelect = (e: SelectEventArgs) => setSelectedElements(e.selectedElements);

        useEffect(() => {
            controller.onSelect.addListener(handleSelect);
            return () => {
                controller.onSelect.removeListener(handleSelect);
            }
        }, [controller]);

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
                    <DiagramElements rootProps={diagramElementRootProps}>
                        <WrappedComponent {...props} />
                    </DiagramElements>
                    <DiagramControls matrix={matrix} controller={controller} />
                </SelectionContext.Provider>
            </InteractionContext.Provider>
        )
    }
}