import { JSXElement } from "./jsx-runtime";
import { ComponentCleanups, ComponentState, DiagramComponent, DiagramNode, EffectCleanup, RenderContextType } from "./diagram";
import { Reference } from "./utils/types";

export interface ContextProviderProps<T> {
    value: T;
    children?: JSXElement;
}

export interface ContextConsumerProps<T> {
    children?: (value: T) => JSXElement;
}

export interface Context<T> {
    defaultValue: T;
    renderContext?: RenderContextType;
    consume(): T;
    provide(node: DiagramNode, value: T): void;
    Provider: DiagramComponent<ContextProviderProps<T>>;
    Consumer: DiagramComponent<ContextConsumerProps<T>>;
}

export function createContext<T>(defaultValue: T): Context<T> {
    const context: Context<T> = {
        defaultValue,
        consume: () => defaultValue,
        provide: (node, value) => {},
        Provider: (props) => undefined,
        Consumer: (props) => undefined
    }

    context.consume = () => {
        const curNode = context.renderContext?.currentNode;
        if (curNode) {
            const componentState = curNode.state = curNode.state || new ComponentState();
            const [storedCleanup] = componentState.current<Reference<EffectCleanup | undefined>>({value: undefined});
            let node: DiagramNode | undefined = curNode;
            while (node && node.context !== context) {
                node = node.parent;
            }
            if (node && curNode && !node.subscriptions?.has(curNode)) {
                const subscriptions = node.subscriptions = node.subscriptions || new Set<DiagramNode>();
                subscriptions.add(curNode);
                const cleanups = curNode.cleanups = curNode.cleanups || new ComponentCleanups();
                storedCleanup.value && cleanups.invokeCleanup(storedCleanup.value);
                storedCleanup.value = () => {
                    subscriptions.delete(curNode);
                }
                cleanups.registerCleanup(storedCleanup.value);

            }
            return node?.contextValue || context.defaultValue;
        }
    }

    context.provide = (node: DiagramNode, value: T) => {
        if (value !== node.contextValue) {
            node.subscriptions?.forEach(x => x.isValid = false);
        }
        node.context = context;
        node.contextValue = value;
        // Root element context must be RenderContext
        while (node.parent) {
            node = node.parent;
        }
        context.renderContext = node.contextValue;
    }

    context.Provider = function(props) {
        context.provide(this, props.value);
        return props.children;
    }

    context.Consumer = function(props) {
        return props.children?.(context.consume());
    }

    return context;
}