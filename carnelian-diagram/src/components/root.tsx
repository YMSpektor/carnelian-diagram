/** @jsxImportSource .. */
import { DiagramElementControls, hasHitTestProps, HitInfo, HitTests, InteractionContext, InteractionContextType } from "../interactivity";
import { DiagramNode, useIdleEffect, useState } from "..";

export interface RootProps {
    svg: SVGGraphicsElement;
    children: DiagramNode[];
}

export function Root(props: RootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | null>(null);
    const [selectedElements, setSelectedElements] = useState(new Set<DiagramNode>);
    const [controls, setControls] = useState<DiagramElementControls[]>([]);

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
        hitTests: new HitTests(),
        isSelected: (element: DiagramNode): boolean => {
            return selectedElements.has(element);
        },
        updateControls: (newControls: DiagramElementControls, prevControls?: DiagramElementControls) => {
            setControls(controls
                .filter(x => x !== prevControls)
                .concat(newControls));
        },
    };

    props.svg.onclick = (e: MouseEvent) => { // TODO: use useEffect
        let hitInfo: HitInfo | undefined;
        if (matrix) {
            const pt = new DOMPoint(e.clientX, e.clientY);
            if (e.target && hasHitTestProps(e.target)) {
                const elementPoint = pt.matrixTransform(matrix);
                hitInfo = {
                    ...e.target.__hitTest,
                    screenX: pt.x,
                    screenY: pt.y,
                    elementX: elementPoint.x,
                    elementY: elementPoint.y,
                }
            }
            else {
                hitInfo = interactions.hitTests.hitTest(pt, matrix);
            }
        }

        if (hitInfo) {
            setSelectedElements(new Set([hitInfo.element]));
            console.log(hitInfo.hitArea);
        }
        else {
            setSelectedElements(new Set([]));
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
                            {control.renderCallback(controlsTransform, control.element)}
                        </>
                    )
                })}
            </g>}
        </InteractionContext.Provider>
    )
}