import { DOMElement } from ".";
export type DiagramElement<P> = (props: P) => DOMElement;
export interface DiagramElementInstance<P> {
    type: DiagramElement<P>;
    props: P;
}
export declare class DiagramDocument {
    private elements;
    private lastTree;
    constructor();
    add<P>(type: DiagramElement<P>, props: P): DiagramElementInstance<P>;
    render(rootNode: Element): Element;
}
