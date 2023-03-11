/** @jsxImportSource .. */
import { DiagramControls, hasHitTestProps, HitInfo, HitTests, InteractionContext } from "../interactivity";
import { DiagramNode, useContext, useIdleEffect, useState } from "..";

export interface RootProps {
    svg: SVGGraphicsElement;
    children: DiagramNode[];
}

export interface DiagramRootProps extends RootProps {
    matrix: DOMMatrix | null;
}

export function Root(props: RootProps): JSX.Element {
    const [matrix, setMatrix] = useState<DOMMatrix | null>(null); // TODO: move to child component once states are fixed

    useIdleEffect(() => {
        const newMatrix = props.svg.getScreenCTM?.()?.inverse() || null;
        if ((newMatrix && !matrix) || 
            (matrix && !newMatrix) || 
            (newMatrix && matrix && (newMatrix.a !== matrix.a || newMatrix.b !== matrix.b || newMatrix.c !== matrix.c || newMatrix.d !== matrix.d || newMatrix.e !== matrix.e || newMatrix.f !== matrix.f)))
        {
            setMatrix(newMatrix);
        }
    });

    const interactions = {
        controls: new DiagramControls(),
        hitTests: new HitTests(),
    };

    return (
        <InteractionContext.Provider value={interactions}>
            <DiagramRoot matrix={matrix} {...props} />
        </InteractionContext.Provider>
    )
}

function DiagramRoot(props: DiagramRootProps): JSX.Element {
    const matrix = props.matrix;
    const interactions = useContext(InteractionContext);

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
            // interactions.selections.set([hitInfo.element]);
            console.log(hitInfo);
        }
    }

    const transform = matrix 
        ? `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        : undefined;

    const DiagramControls = (props: { transform: DOMMatrixReadOnly }): JSX.Element => {
        return interactions.controls.render(props.transform.inverse());
    }

    return (
        <>
            <g>
                {props.children}
            </g>
            {matrix && <g transform={transform}>
                <DiagramControls transform={matrix} />
            </g>}
        </>
    )
}