import { DiagramElementNode, RenderContext, useContext } from "@carnelian-diagram/core";
import { SelectionContext } from "..";

export function useSelection(element?: DiagramElementNode) {
    const renderContext = useContext(RenderContext);
    const curElement = element || renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useSelection hook is not allowed to be called from here. Current element is not defined");
    }

    const selectedElements = useContext(SelectionContext);
    return {
        isSelected: selectedElements.indexOf(curElement) >= 0
    }
}