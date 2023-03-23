import { ComponentChild, ComponentChildren, ComponentType, FunctionComponent, jsxCore, Key, RenderableProps, VirtualNode } from "./jsx-runtime";
import { Root } from "./components/root";
import { DOMBuilder } from "./dom";
import { scheduleImmediate } from "./utils/schedule";
import { WithThis } from "./utils/types";

export class ComponentState {
    private hookIndex = 0;
    private states: any[] = [];

    reset() {
        this.hookIndex = 0;
    }

    current<T>(initialValue: T): [any, number] {
        if (this.hookIndex >= this.states.length) {
            this.states.push(initialValue);
        }
        const hookIndex = this.hookIndex;
        this.hookIndex++;
        return [this.states[hookIndex], hookIndex];
    }

    set<T>(index: number, newValue: T) {
        this.states[index] = newValue;
    }
}

export type EffectCleanup = () => void;
export type Effect = () => EffectCleanup | void;

export class ComponentEffects {
    private cleanupFunctions: EffectCleanup[] = [];

    registerCleanup(cleanup: EffectCleanup) {
        this.cleanupFunctions.push(cleanup);
    }

    invokeCleanup(cleanup: EffectCleanup) {
        cleanup();
        this.cleanupFunctions = this.cleanupFunctions.filter(x => x !== cleanup);
    }

    cleanupAll() {
        this.cleanupFunctions = this.cleanupFunctions.reduce<EffectCleanup[]>((result, cleanup) => {
            cleanup();
            return result;
        }, []);
    }
}

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
    currentValue(): T;
    Provider: DiagramComponent<ContextProviderProps<T>>;
    Consumer: DiagramComponent<ContextConsumerProps<T>>;
}

export function createContext<T>(defaultValue: T): Context<T> {
    const context: Context<T> = {
        defaultValue,
        currentValue: () => defaultValue,
        Provider: (props) => undefined,
        Consumer: (props) => undefined
    }

    context.currentValue = () => {
        let node: DiagramNode | undefined = context.renderContext?.currentNode;
        while (node && node.context !== context) {
            node = node.parent;
        }
        return node?.contextValue || context.defaultValue;
    }

    context.Provider = function(props) {
        this.context = context;
        this.contextValue = props.value;
        // Root element context must be RenderContext
        let node: DiagramNode = this;
        while (node.parent) {
            node = node.parent;
        }
        context.renderContext = node.contextValue;
        return props.children;
    }

    context.Consumer = function(props) {
        return props.children?.(context.currentValue());
    }

    return context;
}

export class ComponentHooks {
    state?: ComponentState;
    effects?: ComponentEffects;

    reset() {
        this.state?.reset();
    }
}

export interface DiagramNode<P = any> extends VirtualNode<P> {
    parent?: DiagramNode;
    children: ComponentChild[];
    hooks: ComponentHooks;
    context?: Context<any>;
    contextValue?: any;
    isElement?: boolean;
    node_type: "diagram-node";
}

const createElement = <P>(
    type: string | ComponentType<P>,
    props: RenderableProps<P>,
    key: Key = undefined
): DiagramNode<P> => {
    return {
        type,
        props,
        key,
        children: [],
        hooks: new ComponentHooks(),
        node_type: "diagram-node"
    };
}

jsxCore.createElement = createElement;

export function isDiagramNode<P>(node: ComponentChild): node is DiagramNode<P> {
    return !!node && typeof node === 'object' && (node as DiagramNode<P>).node_type === 'diagram-node';
}

export function isVirtualNode<P>(node: ComponentChild): node is VirtualNode<P> {
    return isDiagramNode(node);
}

export type DiagramElementProps<P> = P & {
    onChange: (callback: (oldProps: DiagramElementProps<P>) => DiagramElementProps<P>) => void;
}
export type DiagramComponent<P> = WithThis<DiagramNode<P>, FunctionComponent<P>>;
export type DiagramElement<P> = DiagramComponent<DiagramElementProps<P>>;
export type DiagramElementNode<P = any> = DiagramNode<DiagramElementProps<P>>;

export interface DiagramRootProps {
    svg: SVGGraphicsElement;
    children: DiagramElementNode[];
}

export type DiagramRoot<P extends DiagramRootProps> = FunctionComponent<P>;

export class Diagram {
    private lastElementId = 0;
    private elements: DiagramElementNode[] = [];
    private renderContext = new RenderContextType();
    private prevRootNode?: DiagramNode;
    private domBuilder = new DOMBuilder();
    private isValid = false;
    private unschedule?: () => void;
    private attachedRoot?: SVGGraphicsElement;
    private tasks: Array<() => void> = [];

    constructor(private diagramRoot: DiagramRoot<DiagramRootProps>) { }

    private createElementNode<P>(type: DiagramElement<P>, props: P, key: Key): DiagramElementNode<P> {
        const onChange = (callback: (oldProps: DiagramElementProps<P>) => DiagramElementProps<P>) => {
            this.schedule(() => {
                element.props = callback(element.props);
                this.invalidate();
            });
        }
        const element = createElement(type, {...props, onChange}, key);
        return element;
    }

    private copyNodeState<P>(node: DiagramNode<P>, prevNode?: DiagramNode<P>) {
        node.hooks = prevNode?.hooks || node.hooks;
        node.context = node.context || prevNode?.context;
        node.contextValue = node.contextValue || prevNode?.contextValue;
    }

    private unmount(node: ComponentChild) {
        if (isDiagramNode(node)) {
            node.children.forEach(x => this.unmount(x));
            node.hooks.effects?.cleanupAll();
        }
    }

    private render<P>(node: DiagramNode<P>, prevNode?: DiagramNode<P>, parent?: DiagramNode<any>): DiagramNode<P> {
        this.renderContext.currentNode = node;
        this.copyNodeState(node, prevNode);
        node.hooks.reset();
        node.parent = parent;
        let children: ComponentChildren;
        if (typeof node.type === 'function') {
            children = node.type.call(node, node.props);
        }
        else {
            children = node.props.children;
        }

        const prevChildren = prevNode?.children;
        if (children) {
            if (Array.isArray(children)) {
                // @ts-ignore
                node.children = children.flat(Infinity);
            }
            else {
                node.children = [children];
            }
        }
        else {
            node.children = [];
        }

        const nodesToRender: {node: DiagramNode<unknown>, prevNode?: DiagramNode<unknown>, parent?: DiagramNode<P>}[] = [];

        node.children.forEach(child => {
            if (isDiagramNode(child)) {
                let prevChild: DiagramNode<unknown> | undefined;
                if (prevChildren) {
                    const prevChildIndex = prevChildren
                        .findIndex(x => isDiagramNode(x) && x.type === child.type && x.key === child.key);
                    if (prevChildIndex >= 0) {
                        prevChild = prevChildren[prevChildIndex] as DiagramNode<unknown>;
                        prevChildren.splice(prevChildIndex, 1);
                    }
                }
                // First unmount then render
                nodesToRender.push({node: child, prevNode: prevChild, parent: node});
            }
        });

        prevChildren?.forEach(x => this.unmount(x));
        nodesToRender.forEach(x => this.render(x.node, x.prevNode, x.parent));

        return node;
    }

    private commit(root: SVGGraphicsElement, rootNode: DiagramNode): SVGGraphicsElement {
        return this.domBuilder.updateDOM(root, rootNode);
    }

    update(root: SVGGraphicsElement, commitInvalid: boolean): SVGGraphicsElement {
        this.renderContext.currentDiagram = this;
        const rootNode = createElement(Root, {
            renderContext: this.renderContext,
            diagramRoot: this.diagramRoot,
            diagramRootProps: {svg: root, children: this.elements}
        });
        this.prevRootNode = this.render(rootNode, this.prevRootNode);
        this.isValid = true;
        this.renderContext.invokePendingActions();
        this.renderContext.reset();
        return this.isValid || commitInvalid ? this.commit(root, rootNode) : root;
    }

    invalidate() {
        if (this.isValid) {
            this.isValid = false;
            this.attachedRoot && this.scheduleUpdate(this.attachedRoot);
        }
    }

    private scheduleUpdate(root: SVGGraphicsElement) {
        this.scheduleTask(() => {
            this.update(root, false);
        });
    }

    private scheduleTask(task: () => void) {
        this.tasks.push(task);
        if (!this.unschedule) {
            this.unschedule = scheduleImmediate(() => {
                this.unschedule = undefined;
                const tasks = [...this.tasks];
                this.tasks = [];
                tasks.forEach(task => task());
            });
        }
    }

    schedule(action: () => void) {
        if (this.renderContext.isRendering()) {
            this.renderContext.queue(action);
        }
        else {
            this.scheduleTask(() => {
                this.renderContext.currentDiagram = this;
                action();
                this.renderContext.reset();
            });
        }
    }

    attach(root: SVGGraphicsElement) {
        this.attachedRoot = root;
        this.scheduleUpdate(root);
    }

    detach() {
        this.attachedRoot = undefined;
        this.unschedule?.();
        this.unschedule = undefined;
    }

    add<P>(type: DiagramElement<P>, props: P): DiagramElementNode<P> {
        const element = this.createElementNode(type, props, this.lastElementId++);
        element.isElement = true;
        this.elements.push(element);
        this.invalidate();
        return element;
    }
}

export class RenderContextType {
    private pendingActions: Array<() => void> = [];
    currentNode?: DiagramNode;
    currentDiagram?: Diagram;

    reset() {
        this.currentDiagram = undefined;
        this.currentNode = undefined;
    }

    queue(action: () => void) {
        this.pendingActions.push(action);
    }

    currentElement(): DiagramElementNode<unknown> | undefined {
        let node = this.currentNode;
        while (node && !node?.isElement) {
            node = node.parent;
        }
        return node;
    }

    invokePendingActions() {
        let action = this.pendingActions.shift();
        while (action) {
            action();
            action = this.pendingActions.shift();
        }
    }

    isRendering(): boolean {
        return !!this.currentNode;
    }
}

export const RenderContext = createContext<RenderContextType | undefined>(undefined);