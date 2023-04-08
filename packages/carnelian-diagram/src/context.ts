import { JSX } from "./jsx-runtime";
import { ComponentCleanups, ComponentState, DiagramComponent, DiagramNode, EffectCleanup, RenderContextType } from "./diagram";
import { MutableRefObject } from "./utils/types";

export interface ContextProviderProps<T> {
    value: T;
    children?: JSX.Element;
}

export interface ContextConsumerProps<T> {
    children?: (value: T) => JSX.Element;
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
            const [storedCleanup] = componentState.current<MutableRefObject<EffectCleanup | undefined>>({current: undefined});
            let node: DiagramNode | undefined = curNode;
            while (node && node.context !== context) {
                node = node.parent;
            }
            if (node && curNode && !node.subscriptions?.has(curNode)) {
                const subscriptions = node.subscriptions = node.subscriptions || new Set<DiagramNode>();
                subscriptions.add(curNode);
                const cleanups = curNode.cleanups = curNode.cleanups || new ComponentCleanups();
                storedCleanup.current && cleanups.invokeCleanup(storedCleanup.current);
                storedCleanup.current = () => {
                    subscriptions.delete(curNode);
                }
                cleanups.registerCleanup(storedCleanup.current);
            }
            return node?.contextValue || context.defaultValue;
        }
    }

    context.provide = (node: DiagramNode, value: T) => {
        node.context = context;
        node.contextValue = value;
        // Root element context must be RenderContext
        let root = node;
        while (root.parent) {
            root = root.parent;
        }
        context.renderContext = root.contextValue;

        if (value !== node.contextValue) {
            node.subscriptions?.forEach(x => x.isValid = false);
        }
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