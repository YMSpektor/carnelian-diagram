import { renderContext } from "../diagram";

export class ComponentState {
    hookIndex = 0;
    states: any[] = [];

    reset() {
        this.hookIndex = 0;
    }

    current<T>(initialValue: T) {
        if (this.hookIndex >= this.states.length) {
            this.states.push(initialValue);
        }
        return this.states[this.hookIndex];
    }

    set<T>(index: number, newValue: T) {
        this.states[index] = newValue;
    }
}

export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    let curNode = renderContext.currentNode;
    let componentState = curNode?.data?.state;
    if (!componentState) {
        throw new Error("The useState hook is not allowed to be called from here. No state is defined for the current node");
    }
    else {
        const currentState = componentState.current(initialValue);
        const hookIndex = componentState.hookIndex;

        const updateState = (newValue: T) => {
            if (currentState !== newValue) {
                renderContext.effects.push(() => {
                    componentState && componentState.set(hookIndex, newValue);
                    renderContext.currentDiagram?.invalidate();
                });
            }
        }

        componentState.hookIndex++;
        return [currentState, updateState];
    }
}