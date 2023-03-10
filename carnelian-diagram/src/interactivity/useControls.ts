import { renderContext } from "..";
import { RenderControlsCallback } from "./diagram-controls";
import { useInteractions } from "./useInteractions";

export function useControls(callback: RenderControlsCallback) {
    const interactions = useInteractions();
    const curElement = renderContext.currentElement;
    if (curElement) {
        interactions.controls.addControl(curElement, callback);
    }
    else {
        throw new Error("The useControls hook is not allowed to be called from here. It must be called when element is rendering");
    }
}