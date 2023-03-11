import { InteractionContext } from ".";
import { DiagramNode, renderContext, useContext } from "..";
import { HitArea, HitTestCallback } from "./hit-tests";

export function useHitTest(callback: HitTestCallback, hitArea: HitArea, priority: number = 0, element?: DiagramNode) {
    const interactions = useContext(InteractionContext);
    const curElement = element || renderContext.currentElement;
    if (curElement) {
        interactions.hitTests.addHitArea(curElement, callback, hitArea, priority);
    }
    else {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }
}