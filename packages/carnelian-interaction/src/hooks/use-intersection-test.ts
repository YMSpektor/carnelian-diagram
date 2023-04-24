import { RenderContext, useContext, useEffect, useState } from "@carnelian/diagram";
import { DiagramElementIntersectionTest, InteractionContext, IntersectionTestCallback } from "..";
import { Rect } from "../geometry";

export function useIntersectionTest(callback: IntersectionTestCallback, bounds: Rect | null) {
    const renderContext = useContext(RenderContext);
    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useIntersectionTest hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const [key] = useState({});

    const intersectionTest: DiagramElementIntersectionTest = {
        element: curElement,
        callback,
        bounds
    }
    interactions.updateIntersectionTests(key, intersectionTest);

    useEffect(() => {
        return () => {
            interactions.updateIntersectionTests(key, undefined);
        }
    }, []);
}