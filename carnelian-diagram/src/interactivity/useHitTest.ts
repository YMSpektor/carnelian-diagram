import { InteractionContext } from ".";
import { DiagramNode, renderContext, useContext, useEffect, useState } from "..";
import { DiagramElementHitTest, HitArea, HitTestCallback } from "./hit-tests";

export function useHitTest(callback: HitTestCallback, deps: any[], hitArea: HitArea, priority: number = 0, element?: DiagramNode) {
    const curElement = element || renderContext.currentElement;

    if (!curElement) {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }

    const [storedHitTest, setStoredHitTest] = useState<DiagramElementHitTest | undefined>(undefined);
    const interactions = useContext(InteractionContext);

    useEffect(() => {
        const hitTest: DiagramElementHitTest = {
            element: curElement,
            callback,
            hitArea,
            priority
        }
        interactions.updateHitTests(hitTest, storedHitTest);
        setStoredHitTest(hitTest);

        return () => {
            interactions.updateHitTests(undefined, storedHitTest);
        }
    }, deps);
}