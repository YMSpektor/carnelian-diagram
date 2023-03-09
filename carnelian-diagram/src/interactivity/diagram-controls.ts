import { ComponentChild } from "../jsx-runtime";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly) => JSX.Element;

export interface DiagramElementControl {
    renderCallback: RenderControlsCallback;
}

export class DiagramControls {
    private controls: DiagramElementControl[] = [];

    reset() {
        this.controls = [];
    }

    addControl(callback: RenderControlsCallback) {
        this.controls.push({
            renderCallback: callback
        });
    }

    render(transform: DOMMatrixReadOnly): JSX.Element {
        return this.controls.reduce<ComponentChild[]>((acc, cur) => acc.concat(cur.renderCallback(transform)), []);
    }
}