import { DiagramNode, renderContext } from "..";
import { HitArea, HitTestCallback } from "./hit-tests";
import { useInteractions } from "./useInteractions";

export function useHitTest(callback: HitTestCallback, hitArea: HitArea, element?: DiagramNode) {
    const interactions = useInteractions();
    const curElement = element || renderContext.currentElement;
    if (curElement) {
        interactions.hitTests.addHitArea(curElement, callback, hitArea);
    }
    else {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }
}