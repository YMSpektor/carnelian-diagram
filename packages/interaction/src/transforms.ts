import { DiagramElementNode } from "@carnelian-diagram/core";
import { degToRad, Point } from "./geometry";

export interface DiagramElementTransform<T> {
    element: DiagramElementNode;
    transform: DOMMatrixReadOnly;
}

export interface DiagramElementTransforms {
    result: DOMMatrix;
    transformMap: Map<object, DiagramElementTransform<any>>;
}

export function computeTransformResult(transforms: DiagramElementTransforms) {
    transforms.result = [...transforms.transformMap.values()].reduce<DOMMatrix>((acc, cur) => acc.multiply(cur.transform), new DOMMatrix());
}

export function rotateTransform(angle: number, p?: Point) {
    angle = degToRad(angle);
    return new DOMMatrix([
        Math.cos(angle),
        Math.sin(angle),
        -Math.sin(angle),
        Math.cos(angle),
        p ? p.x * (1 - Math.cos(angle)) + p.y * Math.sin(angle) : 0,
        p ? p.y * (1 - Math.cos(angle)) - p.x * Math.sin(angle) : 0
    ]);
}