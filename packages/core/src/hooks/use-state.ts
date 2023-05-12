import { useContext } from "./use-context";
import { ComponentState, RenderContext } from "../diagram";

export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    const renderContext = useContext(RenderContext);
    let curNode = renderContext?.currentNode;
    if (!curNode) {
        throw new Error("The useState hook is not allowed to be called from here. Current element is not defined");
    }
    
    const componentState = curNode.state = (curNode.state || new ComponentState());
    const [currentState, hookIndex] = componentState.current(initialValue);

    const updateState = (newValue: T) => {
        const currentState = componentState.get<T>(hookIndex); // Don't use the currentState from closure, can work incorrectly inside useEffect and other callbacks
        if (!Object.is(currentState, newValue)) {
            renderContext?.queue(() => {
                componentState.set(hookIndex, newValue);
                renderContext?.invalidate(curNode);
            });
        }
    }

    return [currentState, updateState];
}