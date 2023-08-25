import { DiagramElementNode, RenderContext, useContext, useEffect, useState } from "@carnelian-diagram/core";
import { InteractionContext } from "..";
import { Rect } from "../geometry";
import { DiagramElementHitTest, HitArea, HitTestCallback } from "../hit-tests";

export function useHitTest(callback: HitTestCallback, bounds: Rect | null, hitArea: HitArea, tolerance: number = 0,
        priority: number = 0, element?: DiagramElementNode) {
    const renderContext = useContext(RenderContext);
    const curElement = element || renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const [key] = useState({});

    const hitTest: DiagramElementHitTest = {
        element: curElement,
        callback,
        bounds,
        hitArea,
        tolerance,
        priority
    }
    interactions.updateHitTests(curElement, priority, key, hitTest);

    useEffect(() => {
        return () => {
            interactions.updateHitTests(curElement, priority, key, undefined);
        }
    }, []);
}