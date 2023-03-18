import { DiagramElementControls } from "./diagram-controls";

export interface InteractionControllerType {
    updateControls: (controls?: DiagramElementControls, prevControls?: DiagramElementControls) => void;
    renderControls: (transform: DOMMatrixReadOnly) => JSX.Element;
}

export class InteractionController implements InteractionControllerType {
    private controls: DiagramElementControls[] = [];

    constructor(private svg: SVGGraphicsElement) {}

    updateControls(newControls?: DiagramElementControls, prevControls?: DiagramElementControls) {
        let newValue = prevControls ? this.controls.filter(x => x !== prevControls) : this.controls;
        newValue = newControls ? newValue.concat(newControls) : newValue;
        this.controls = newValue;
    }

    renderControls(transform: DOMMatrixReadOnly): JSX.Element {
        return this.controls.map(x => x.callback(transform, x.element));
    }
}