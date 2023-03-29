import { DiagramElementNode, RenderContext, useContext, useEffect, useRef } from "@carnelian/diagram";
import { InteractionContext } from "..";
import { DiagramElementHitTest, HitArea, HitTestCallback } from "../hit-tests";

export function useHitTest(callback: HitTestCallback, hitArea: HitArea, priority: number = 0, element?: DiagramElementNode) {
    const renderContext = useContext(RenderContext);
    const curElement = element || renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const storedHitTest = useRef<DiagramElementHitTest | undefined>(undefined);

    const hitTest: DiagramElementHitTest = {
        element: curElement,
        callback,
        hitArea,
        priority
    }
    interactions.updateHitTests(hitTest, storedHitTest.current);
    storedHitTest.current = hitTest; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateHitTests(undefined, storedHitTest.current);
            storedHitTest.current = undefined;
        }
    }, [interactions]);
}