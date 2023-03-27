import { useContext } from "./useContext";
import { ComponentState, RenderContext } from "../diagram";

export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    const renderContext = useContext(RenderContext);
    let curNode = renderContext?.currentNode;
    const diagram = renderContext?.currentDiagram;
    if (!curNode) {
        throw new Error("The useState hook is not allowed to be called from here. Current element is not defined");
    }
    
    const componentState = curNode.state = curNode.state || new ComponentState();
    const [currentState, hookIndex] = componentState.current(initialValue);

    const updateState = (newValue: T) => {
        if (currentState !== newValue) {
            diagram?.schedule(() => {
                componentState.set(hookIndex, newValue);
                diagram?.invalidate(curNode);
            });
        }
    }

    return [currentState, updateState];
}