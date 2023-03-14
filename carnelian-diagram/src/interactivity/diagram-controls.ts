import { DiagramNode } from "..";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramNode) => JSX.Element;

export interface DiagramElementControls {
    element: DiagramNode;
    callback: RenderControlsCallback;
}