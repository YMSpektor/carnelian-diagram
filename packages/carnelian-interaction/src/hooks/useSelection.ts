import { DiagramNode, RenderContext, useContext } from "@carnelian/diagram";
import { SelectionContext } from "..";

export function useSelection(element?: DiagramNode) {
    const renderContext = useContext(RenderContext);
    const curElement = element || renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }

    const selectedElements = useContext(SelectionContext);
    return {
        isSelected: selectedElements.indexOf(curElement) >= 0
    }
}