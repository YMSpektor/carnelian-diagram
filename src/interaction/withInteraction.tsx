/** @jsxImportSource .. */
import { DiagramElementNode, DiagramRootComponent, DiagramRootProps, useEffect, useState } from "..";
import {
    InteractionContext, 
    InteractionController, 
    RectSelectionEventArgs, 
    SelectEventArgs, 
    SelectionContext
} from ".";
import { scheduleIdle } from "../utils/schedule";
import { EventListener } from "../utils/events";
import { Rect } from "../geometry";
import { JSX } from "../jsx-runtime";

const DiagramElements = (props: { children: JSX.Element }) => {
    return (
        <g>
            {props.children}
        </g>
    );
}

interface DiagramControlsProps {
    matrix: DOMMatrixReadOnly | undefined;
    controller: InteractionController;
}

const DiagramControls = (props: DiagramControlsProps) => {
    const { matrix, controller } = props;
    const [rectSelection, setRectSelection] = useState<Rect | null>(null);

    const handleRectSelection: EventListener<RectSelectionEventArgs> = (e) => setRectSelection(e.selectionRect);

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
        matrix && <g transform={transform}>
            {controller?.renderControls(matrix.inverse())}
            {rectSelection && <rect {...rectSelection} fill="none" stroke="black" stroke-dasharray="4" />}
        </g>
    );
}

export const withInteraction = ( 
    WrappedComponent: DiagramRootComponent,
    controller: InteractionController
): DiagramRootComponent => {
    return (props: DiagramRootProps) => {
        const [matrix, setMatrix] = useState<DOMMatrix | undefined>(undefined);
        const [selectedElements, setSelectedElements] = useState<DiagramElementNode[]>([]);

        controller.elements = props.children;

        const handleSelect: EventListener<SelectEventArgs> = (e) => setSelectedElements(e.selectedElements);

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
            <InteractionContext.Provider value={controller.getContextValue()}>
                <SelectionContext.Provider value={selectedElements}>
                    <DiagramElements>
                        <WrappedComponent {...props} />
                    </DiagramElements>
                    <DiagramControls matrix={matrix} controller={controller} />
                </SelectionContext.Provider>
            </InteractionContext.Provider>
        )
    }
}