import { InteractionContext } from ".";
import { DiagramNode, renderContext, useContext, useEffect, useState } from "..";
import { DiagramElementHitTest, HitArea, HitTestCallback } from "./hit-tests";

export function useHitTest<P>(callback: HitTestCallback, hitArea: HitArea<P>, priority: number = 0, element?: DiagramNode) {
    const curElement = element || renderContext.currentElement;
    if (!curElement) {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        throw new Error("InteractionContext is not defined");
    }

    const [storedHitTest] = useState<[DiagramElementHitTest | undefined]>([undefined]);

    const hitTest: DiagramElementHitTest = {
        element: curElement,
        callback,
        hitArea,
        priority
    }
    interactions.updateHitTests(hitTest, storedHitTest[0]);
    storedHitTest[0] = hitTest; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateHitTests(undefined, storedHitTest[0]);
        }
    }, [interactions]);
}