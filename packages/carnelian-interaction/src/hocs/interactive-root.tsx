/** @jsxImportSource @carnelian/diagram */

import { DiagramElementNode, DiagramRootComponent, DiagramRootProps, useEffect, useState } from "@carnelian/diagram";
import {
    ControlsContext,
    InteractionContext, 
    InteractionController, 
    isControlRenderingService, 
    PaperChangeEventArgs, 
    PaperOptions, 
    RectSelectionEventArgs, 
    SelectEventArgs, 
    SelectionContext
} from "..";
import { scheduleIdle } from "@carnelian/diagram/utils/schedule";
import { JSX } from "@carnelian/diagram/jsx-runtime";
import { Rect } from "../geometry";

function getTransformAttribute(matrix?: DOMMatrixReadOnly) {
    return matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;
}

function DiagramPaper(props: PaperOptions & {matrix?: DOMMatrixReadOnly}) {
    let { x, y, width, height, matrix } = props;
    const p1 = new DOMPoint(x, y).matrixTransform(matrix);
    const p2 = new DOMPoint(x + width, y + height).matrixTransform(matrix);
    const scale = matrix ? matrix.a : 1;
    x = p1.x;
    y = p1.y;
    width = p2.x - p1.x;
    height = p2.y - p1.y;
    
    const patternSize = Math.max(props.majorGridSize || 0, props.minorGridSize || 0) * scale;
    const minorGridSize = props.minorGridSize ? props.minorGridSize * scale : props.minorGridSize;
    const majorGridSize = props.majorGridSize ? props.majorGridSize * scale : props.majorGridSize;

    function drawGridLines(gridSize: number, color: string) {
        const lines: JSX.Element[] = [];
        let x = 0;
        let y = 0;
        while (x < patternSize) {
            lines.push(
                <line x1={x} y1={0} x2={x} y2={patternSize} stroke={color} />
            );
            x += gridSize;
        }
        while (y < patternSize) {
            lines.push(
                <line x1={0} y1={y} x2={patternSize} y2={y} stroke={color} />
            );
            y += gridSize;
        }
        return lines;
    }

    return (
        <>
            {patternSize > 0 && <defs>
                <pattern id="paper-grid" x={x} y={y} width={patternSize} height={patternSize} patternUnits="userSpaceOnUse">
                    <rect x={0} y={0} width={patternSize} height={patternSize} fill="white" stroke="none" />
                    {minorGridSize && drawGridLines(minorGridSize, props.minorGridColor || "#eee")}
                    {majorGridSize && drawGridLines(majorGridSize, props.majorGridColor || "#bbb")}
                </pattern>
            </defs>}
            <g className="paper-container" transform={getTransformAttribute(matrix?.inverse())}>
                <rect x={x} y={y} width={width} height={height} className="paper" fill="url(#paper-grid)" />
            </g>
        </>
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
    
    let rect: DOMRectInit | null = null;
    if (rectSelection) {
        const p1 = new DOMPoint(rectSelection.x, rectSelection.y).matrixTransform(matrix);
        const p2 = new DOMPoint(rectSelection.x + rectSelection.width, rectSelection.y + rectSelection.height).matrixTransform(matrix);
        rect = {
            x: p1.x,
            y: p1.y,
            width: p2.x - p1.x,
            height: p2.y - p1.y
        }
    }

    const handleRectSelection = (e: RectSelectionEventArgs) => setRectSelection(e.selectionRect);

    useEffect(() => {
        controller.onRectSelection.addListener(handleRectSelection);
        return () => {
            controller.onRectSelection.removeListener(handleRectSelection);
        }
    }, [controller]);

    const renderControlsContext = controller.getService(isControlRenderingService)?.controlsContext || ControlsContext.defaultValue;

    return (
        <ControlsContext.Provider value={renderControlsContext}>
            <g transform={getTransformAttribute(matrix?.inverse())}>
                {controller.renderControls(matrix || new DOMMatrix())}
                {rect && <rect className="selection-rect" {...rect} fill="none" stroke="black" stroke-dasharray="4" />}
            </g>
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
        const [paper, setPaper] = useState(controller.getPaper());

        const handleSelect = (e: SelectEventArgs) => setSelectedElements(e.selectedElements);
        const handlePaperChange = (e: PaperChangeEventArgs) => setPaper(e.paper);
        const calcCTM = () => props.svg.getCTM?.() || undefined;
        const calcScreenCTM = () => props.svg.getScreenCTM?.() || undefined;
        const ctm = calcCTM();

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
                const CMT = calcCTM();
                if ((CMT && !curMatrix) || 
                    (curMatrix && !CMT) || 
                    (CMT && curMatrix && (CMT.a !== curMatrix.a || CMT.b !== curMatrix.b || CMT.c !== curMatrix.c || CMT.d !== curMatrix.d || CMT.e !== curMatrix.e || CMT.f !== curMatrix.f)))
                {
                    curMatrix = CMT;
                    setMatrix(CMT);
                }
                controller.screenCTM = calcScreenCTM();

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
                    {paper && <DiagramPaper {...paper} matrix={ctm} />}
                    <DiagramElements rootProps={options?.elementsRootProps}>
                        <WrappedComponent {...props} />
                    </DiagramElements>
                    <DiagramControls matrix={ctm} controller={controller} />
                </SelectionContext.Provider>
            </InteractionContext.Provider>
        )
    }
}