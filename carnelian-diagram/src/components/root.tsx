/** @jsxImportSource .. */
import { DiagramNode, useEffect, useIdleEffect, useState } from "..";
import { 
    DiagramElementControls, 
    DiagramElementHitTest, 
    HitAreaCollection, 
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
        props.svg.onclick = (e: MouseEvent) => {
            const hitInfo = matrix && hitTest(e, hitTests, matrix);
    
            if (hitInfo) {
                setSelectedElements(new Set([hitInfo.element]));
                console.log(hitInfo.hitArea);
            }
            else {
                setSelectedElements(new Set([]));
            }
        }
    }, [matrix, hitTests]);
    

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