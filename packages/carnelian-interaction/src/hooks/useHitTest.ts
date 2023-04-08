import { DiagramElementNode, RenderContext, useContext, useEffect, useState } from "@carnelian/diagram";
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

    const [key] = useState({priority, element: curElement});
    key.priority = priority;
    key.element = curElement;

    const hitTest: DiagramElementHitTest = {
        element: curElement,
        callback,
        hitArea,
        priority
    }
    interactions.updateHitTests(key, hitTest);

    useEffect(() => {
        return () => {
            interactions.updateHitTests(key, undefined);
        }
    }, []);
}