import { renderContext } from "..";
import { HitArea, HitTestCallback } from "./hit-tests";
import { useInteractions } from "./useInteractions";

export function useHitTest(callback: HitTestCallback, hitArea: HitArea) {
    const interactions = useInteractions();
    const curNode = renderContext.currentNode;
    if (curNode) {
        interactions.hitTests.addHitArea(curNode, callback, hitArea);
    }
    else {
        throw new Error("The useHitTest hook is not allowed to be called from here. It must be called at the render phase");
    }
}