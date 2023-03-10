import { RenderControlsCallback } from "./diagram-controls";
import { useInteractions } from "./useInteractions";

export function useControls(callback: RenderControlsCallback) {
    const interactions = useInteractions();
    if (interactions) {
        interactions.controls.addControl(callback);
    }
}