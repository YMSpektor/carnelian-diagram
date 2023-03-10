import { DiagramNode } from "..";
import { ComponentChild } from "../jsx-runtime";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramNode) => JSX.Element;

export interface DiagramElementControl {
    element: DiagramNode;
    renderCallback: RenderControlsCallback;
}

export class DiagramControls {
    private controls: DiagramElementControl[] = [];

    reset() {
        this.controls = [];
    }

    addControl(element: DiagramNode, callback: RenderControlsCallback) {
        this.controls.push({
            element,
            renderCallback: callback
        });
    }

    render(transform: DOMMatrixReadOnly): JSX.Element {
        return this.controls.reduce<ComponentChild[]>((acc, cur) => acc.concat(cur.renderCallback(transform, cur.element)), []);
    }
}