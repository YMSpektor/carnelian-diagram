/** @jsxImportSource .. */
import { DiagramNode, renderContext, useEffect, useIdleEffect, useState } from "..";
import { 
    DiagramElementControls, 
    DiagramElementHitTest, 
    HitAreaCollection, 
    HitInfo, 
    hitTest, 
    InteractionContext, 
    InteractionContextType, 
    InteractionController
} from "../interactivity";

export interface RootProps {
    svg: SVGGraphicsElement;
    children: DiagramNode[];
}

export function Root(props: RootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | null>(null);
    const [selectedElements, setSelectedElements] = useState(new Set<DiagramNode>);
    const [hitTests, setHitTests] = useState<HitAreaCollection>({});
    const [controller] = useState(new InteractionController(props.svg));

    useIdleEffect(() => {
        const newMatrix = props.svg.getScreenCTM?.()?.inverse() || null;
        if ((newMatrix && !matrix) || 
            (matrix && !newMatrix) || 
            (newMatrix && matrix && (newMatrix.a !== matrix.a || newMatrix.b !== matrix.b || newMatrix.c !== matrix.c || newMatrix.d !== matrix.d || newMatrix.e !== matrix.e || newMatrix.f !== matrix.f)))
        {
            setMatrix(newMatrix);
        }
    });

    const interactions: InteractionContextType = {
        isSelected: (element: DiagramNode): boolean => {
            return selectedElements.has(element);
        },
        updateControls: (newControls?: DiagramElementControls, prevControls?: DiagramElementControls) => {
            controller.updateControls(newControls, prevControls);
        },
        updateHitTests: (newHitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest) => {
            if (prevHitTests) {
                hitTests[prevHitTests.priority] = hitTests[prevHitTests.priority].filter(x => x !== prevHitTests);
            }
            if (newHitTests) {
                hitTests[newHitTests.priority] = (hitTests[newHitTests.priority] || []).concat(newHitTests);
            }
            setHitTests({...hitTests});
        }
    };

    useEffect(() => {
        props.svg.onmousedown = (e: MouseEvent) => {
            const hitInfo = matrix && hitTest(e, hitTests, matrix);
    
            if (hitInfo) {
                const isSelected = selectedElements.has(hitInfo.element);

                if (e.shiftKey) {
                    if (isSelected) {
                        selectedElements.delete(hitInfo.element);
                        props.svg.style.cursor = "";
                    }
                    else {
                        selectedElements.add(hitInfo.element);
                        props.svg.style.cursor = hitInfo.hitArea.cursor || "";
                    }
                    setSelectedElements(new Set(selectedElements));
                } 
                else {
                    if (!isSelected) {
                        setSelectedElements(new Set([hitInfo.element]));
                        props.svg.style.cursor = hitInfo.hitArea.cursor || "";
                    }
                    else {
                        beginDrag(e, [...selectedElements], hitInfo, matrix);
                    }
                }
            }
            else {
                selectedElements.size && setSelectedElements(new Set([]));
                props.svg.style.cursor = "";
            }
        }

        props.svg.onmousemove = (e: MouseEvent) => {
            const hitInfo = matrix && hitTest(e, hitTests, matrix);
            const isSelected = hitInfo && selectedElements.has(hitInfo.element);

            props.svg.style.cursor = isSelected ? hitInfo?.hitArea.cursor || "" : "";
        }
    }, [matrix, hitTests, selectedElements]);

    function beginDrag(e: MouseEvent, elements: DiagramNode[], hitInfo: HitInfo<any>, transform: DOMMatrixReadOnly) {
        const startPoint = new DOMPoint(e.clientX, e.clientY).matrixTransform(transform);
        let lastPoint = startPoint;

        if (hitInfo.hitArea.dragHandler) {
            const dragHandler = hitInfo.hitArea.dragHandler;

            const mouseMoveHandler = (e: MouseEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY);
                const elementPoint = point.matrixTransform(transform);

                dragHandler(elementPoint, lastPoint, startPoint, (props) => {
                    renderContext.effects.push(() => {
                        hitInfo.element.props = props;
                        renderContext.currentDiagram?.invalidate();
                    });
                });

                lastPoint = elementPoint;
            }

            const mouseUpHandler = (e: MouseEvent) => {
                window.removeEventListener("mousemove", mouseMoveHandler);
                window.removeEventListener("mouseup", mouseUpHandler);
            }

            window.addEventListener("mousemove", mouseMoveHandler);
            window.addEventListener("mouseup", mouseUpHandler);
        }
    }    

    const DiagramElements = (props: { elements: DiagramNode[] }) => {
        return (
            <g>
                {props.elements}
            </g>
        );
    }

    const DiagramControls = (props: { matrix: DOMMatrixReadOnly | null }) => {
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
        <InteractionContext.Provider value={interactions}>
            <DiagramElements elements={props.children} />
            <DiagramControls matrix={matrix} />
        </InteractionContext.Provider>
    )
}
