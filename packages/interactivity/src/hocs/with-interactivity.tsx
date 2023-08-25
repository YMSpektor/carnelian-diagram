/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElementNode, DiagramRootComponent, DiagramRootProps, useEffect, useState } from "@carnelian-diagram/core";
import {
    ControlsContext,
    InteractionContext, 
    InteractionController, 
    isControlRenderingService, 
    PaperChangeEventArgs, 
    Paper, 
    RectSelectionEventArgs, 
    SelectEventArgs, 
    SelectionContext,
    isPaperService,
    RECT_SELECTION_EVENT,
    PAPER_CHANGE_EVENT,
    SELECT_EVENT
} from "..";
import { scheduleIdle } from "@carnelian-diagram/core/utils/schedule";
import { JSX } from "@carnelian-diagram/core/jsx-runtime";
import { Rect } from "../geometry";

function getTransformAttribute(matrix?: DOMMatrixReadOnly) {
    return matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;
}

function svgMatrixToDomMatrix(matrix?: DOMMatrix): DOMMatrix | undefined {
    return matrix ? new DOMMatrix([matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]) : matrix;
}

function DiagramPaper(props: Paper & {matrix?: DOMMatrixReadOnly}) {
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
            <g className="paper-layer" transform={getTransformAttribute(matrix?.inverse())}>
                <rect x={x} y={y} width={width} height={height} className="paper" fill={patternSize > 0 ? "url(#paper-grid)" : "white"} />
            </g>
        </>
    )
}

function DiagramElements<P>(props: { children: JSX.Element, rootProps: P }) {
    return (
        <g className="elements-layer" {...props.rootProps}>
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
        controller.addEventListener(RECT_SELECTION_EVENT, handleRectSelection);
        return () => {
            controller.removeEventListener(RECT_SELECTION_EVENT, handleRectSelection);
        }
    }, [controller]);

    const renderControlsContext = controller.getService(isControlRenderingService)?.controlsContext || ControlsContext.defaultValue;

    return (
        <ControlsContext.Provider value={renderControlsContext}>
            <g className="element-controls-layer" transform={getTransformAttribute(matrix?.inverse())}>
                {controller.renderControls(matrix || new DOMMatrix())}
                {rect && <rect className="selection-rect" {...rect} fill="none" stroke="black" stroke-dasharray="4" />}
            </g>
        </ControlsContext.Provider>
    );
}

export interface InteractiveRootOptions<P> {
    elementsRootProps?: P;
}

export function withInteractivity<P>( 
    WrappedComponent: DiagramRootComponent,
    controller: InteractionController,
    options?: InteractiveRootOptions<P>
): DiagramRootComponent {
    return (props: DiagramRootProps) => {
        const [matrix, setMatrix] = useState<DOMMatrix | undefined>(undefined);
        const [selectedElements, setSelectedElements] = useState<DiagramElementNode[]>([]);
        const [paper, setPaper] = useState(controller.getService(isPaperService)?.paper || null);

        const handleSelect = (e: SelectEventArgs) => setSelectedElements(e.selectedElements);
        const handlePaperChange = (e: PaperChangeEventArgs) => setPaper(e.paper);
        const calcCTM = () => svgMatrixToDomMatrix(props.svg.getCTM?.() || undefined);
        const calcScreenCTM = () => svgMatrixToDomMatrix(props.svg.getScreenCTM?.() || undefined);
        const ctm = calcCTM();

        useEffect(() => {
            controller.addEventListener(SELECT_EVENT, handleSelect);
            controller.addEventListener(PAPER_CHANGE_EVENT, handlePaperChange);

            return () => {
                controller.removeEventListener(SELECT_EVENT, handleSelect);
                controller.removeEventListener(PAPER_CHANGE_EVENT, handlePaperChange);
            }
        }, [controller]);

        useEffect(() => {
            let cancelSchedule: () => void;
            let curMatrix = matrix;

            const workloop = () => {
                const CTM = calcCTM();
                if ((CTM && !curMatrix) || 
                    (curMatrix && !CTM) || 
                    (CTM && curMatrix && (CTM.a !== curMatrix.a || CTM.b !== curMatrix.b || CTM.c !== curMatrix.c || CTM.d !== curMatrix.d || CTM.e !== curMatrix.e || CTM.f !== curMatrix.f)))
                {
                    curMatrix = CTM;
                    setMatrix(CTM);
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