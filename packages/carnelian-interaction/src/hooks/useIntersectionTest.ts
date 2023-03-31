import { RenderContext, useContext, useEffect, useRef } from "@carnelian/diagram";
import { DiagramElementIntersectionTest, InteractionContext, IntersectionTestCallback } from "..";
import { Rect } from "../geometry";

export function useIntersectionTest(callback: IntersectionTestCallback, bounds: Rect) {
    const renderContext = useContext(RenderContext);
    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useIntersectionTest hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const storedIntersectionTest = useRef<DiagramElementIntersectionTest | undefined>(undefined);

    const intersectionTest: DiagramElementIntersectionTest = {
        element: curElement,
        callback,
        bounds
    }
    interactions.updateIntersectionTests(intersectionTest, storedIntersectionTest.current);
    storedIntersectionTest.current = intersectionTest; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateIntersectionTests(undefined, storedIntersectionTest.current);
            storedIntersectionTest.current = undefined;
        }
    }, [interactions]);
}