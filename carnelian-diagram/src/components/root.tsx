/** @jsxImportSource .. */
import { DiagramNode, renderContext, useEffect, useIdleEffect, useState } from "..";
import { 
    DiagramElementControls, 
    DiagramElementHitTest, 
    HitAreaCollection, 
    HitInfo, 
    hitTest, 
    InteractionContext, 
    InteractionContextType } from "../interactivity";

export interface RootProps {
    svg: SVGGraphicsElement;
    children: DiagramNode[];
}

export function Root(props: RootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | null>(null);
    const [selectedElements, setSelectedElements] = useState(new Set<DiagramNode>);
    const [controls, setControls] = useState<DiagramElementControls[]>([]);
    const [hitTests, setHitTests] = useState<HitAreaCollection>({});

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
            let newValue = prevControls ? controls.filter(x => x !== prevControls) : controls;
            newValue = newControls ? newValue.concat(newControls) : newValue;
            setControls(newValue);
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
                    }
                    else {
                        selectedElements.add(hitInfo.element);
                    }
                    setSelectedElements(new Set(selectedElements));
                } 
                else {
                    if (!isSelected) {
                        setSelectedElements(new Set([hitInfo.element]));
                    }
                    else {
                        beginDrag(e, [...selectedElements], hitInfo, matrix);
                    }
                }
            }
            else {
                selectedElements.size && setSelectedElements(new Set([]));
            }
        }
    }, [matrix, hitTests, selectedElements]);

    function beginDrag(e: MouseEvent, elements: DiagramNode[], hitInfo: HitInfo<any>, transform: DOMMatrixReadOnly) {
        if (hitInfo.hitArea.dragHandler) {
            console.log("Begin drag...");
            const dragHandler = hitInfo.hitArea.dragHandler;

            const mouseMoveHandler = (e: MouseEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY);
                const elementPoint = point.matrixTransform(transform);

                dragHandler(elementPoint, (props) => {
                    renderContext.effects.push(() => {
                        hitInfo.element.props = props;
                        renderContext.currentDiagram?.invalidate();
                    });
                });

                console.log("Dragging...");
            }

            const mouseUpHandler = (e: MouseEvent) => {
                console.log("End drag...");
                window.removeEventListener("mousemove", mouseMoveHandler);
                window.removeEventListener("mouseup", mouseUpHandler);
            }

            window.addEventListener("mousemove", mouseMoveHandler);
            window.addEventListener("mouseup", mouseUpHandler);
        }
    }    

    const transform = matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;

    return (
        <InteractionContext.Provider value={interactions}>
            <g>
                {props.children}
            </g>
            {matrix && <g transform={transform}>
                {controls.map((control) => {
                    const controlsTransform = matrix.inverse();
                    return (
                        <>
                            {control.callback(controlsTransform, control.element)}
                        </>
                    )
                })}
            </g>}
        </InteractionContext.Provider>
    )
}
