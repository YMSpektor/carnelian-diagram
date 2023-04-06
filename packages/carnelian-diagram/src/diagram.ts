import { 
    ComponentChild, 
    ComponentChildren, 
    ComponentType, 
    FunctionComponent, 
    jsxCore, 
    Key, 
    RenderableProps, 
    VirtualNode
} from "./jsx-runtime";
import { App } from "./components/app";
import { DiagramDOMBuilder } from "./dom-builder";
import { scheduleImmediate } from "./utils/schedule";
import { WithThis } from "./utils/types";
import { Context, createContext } from "./context";

export class ComponentState {
    private hookIndex = 0;
    private states: any[] = [];

    reset() {
        this.hookIndex = 0;
    }

    current<T>(initialValue: T): [T, number] {
        if (this.hookIndex >= this.states.length) {
            this.states.push(initialValue);
        }
        const hookIndex = this.hookIndex;
        this.hookIndex++;
        return [this.states[hookIndex], hookIndex];
    }

    get<T>(index: number): T {
        return this.states[index];
    }

    set<T>(index: number, newValue: T) {
        this.states[index] = newValue;
    }
}

export type EffectCleanup = () => void;
export type Effect = () => EffectCleanup | void;

export class ComponentCleanups {
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

export interface DiagramNode<P = any> extends VirtualNode<P> {
    parent?: DiagramNode;
    children: ComponentChild[];
    state?: ComponentState;
    cleanups?: ComponentCleanups;
    context?: Context<any>;
    contextValue?: any;
    subscriptions?: Set<DiagramNode>;
    isElement?: boolean;
    isValid?: boolean;
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

export type DiagramElementChangeHandler<P> = (callback: (oldProps: DiagramElementProps<P>) => DiagramElementProps<P>) => void;

export type DiagramElementProps<P> = P & {
    onChange: DiagramElementChangeHandler<P>;
}
export type DiagramComponent<P> = WithThis<DiagramNode<P>, FunctionComponent<P>>;
export type DiagramElement<P extends object> = DiagramComponent<DiagramElementProps<P>>;
export type DiagramElementNode<P = any> = DiagramNode<DiagramElementProps<P>>;

export interface DiagramRootProps {
    svg: SVGGraphicsElement;
    children: DiagramElementNode[];
}

export type DiagramRootComponent = DiagramComponent<DiagramRootProps>;

interface DiagramSubscription {
    isValid: boolean;
    callback: () => void;
    unsubscribe: () => void;
}

export interface DiagramDOMRenderer {
    render: (commitInvalid?: boolean) => void;
    clear: () => void;
    attach: () => void;
    detach: (clearDom: boolean) => void;
}

export class Diagram {
    private lastElementId = 0;
    private elements: DiagramElementNode[] = [];
    private subscriptions: DiagramSubscription[] = [];

    private createElementNode<P extends object>(type: DiagramElement<P>, props: P, key: Key): DiagramElementNode<P> {
        const onChange = (callback: (oldProps: DiagramElementProps<P>) => DiagramElementProps<P>) => {
            this.update(element, callback(element.props));
        }
        const element = createElement(type, {...props, onChange}, key);
        return element;
    }

    private subscribe(callback: () => void): DiagramSubscription {
        const subscription = {
            isValid: false,
            callback,
            unsubscribe: () => {
                this.subscriptions = this.subscriptions.filter(x => x !== subscription);
            }
        }
        this.subscriptions.push(subscription);
        return subscription;
    }

    isValid() : boolean {
        return this.subscriptions.every(x => x.isValid);
    }

    invalidate(node?: DiagramNode) {
        if (node) {
            node.isValid = false;
        }
        if (this.isValid()) {
            this.subscriptions.forEach(s => {
                s.isValid = false;
                s.callback();
            });
        }
    }

    getElements(): DiagramElementNode[] {
        return [...this.elements];
    }

    add<P extends object>(type: DiagramElement<P>, props: P): DiagramElementNode<P> {
        const element = this.createElementNode(type, props, this.lastElementId++);
        element.isElement = true;
        this.elements.push(element);
        this.invalidate(element);
        return element;
    }

    update<T>(element: DiagramElementNode<T>, props: DiagramElementProps<T>) {
        element.props = props;
        this.invalidate(element);
    }

    delete(element: DiagramElementNode): void;
    delete(elements: DiagramElementNode[]): void;
    delete(elements: DiagramElementNode | DiagramElementNode[]) {
        if (!Array.isArray(elements)) {
            this.delete([elements]);
        }
        else {
            this.elements = this.elements.filter(x => !elements.includes(x));
            this.invalidate();
        }
    }

    clear() {
        this.elements = [];
        this.invalidate();
    }

    createDomRenderer(root: SVGGraphicsElement, rootComponent: DiagramRootComponent): DiagramDOMRenderer {
        const domBuilder = new DiagramDOMBuilder(root);
        let isAttached = false;
        let subscription: DiagramSubscription | undefined = undefined;
        let prevRootNode: DiagramNode | undefined = undefined;
        const renderContext = new RenderContextType(this);
    
        const initNode = <P>(node: DiagramNode<P>, prevNode?: DiagramNode<P>) => {
            node.state = prevNode?.state || node.state;
            node.cleanups = prevNode?.cleanups || node.cleanups;
            node.context = node.context || prevNode?.context;
            node.contextValue = node.contextValue || prevNode?.contextValue;
            node.subscriptions = prevNode?.subscriptions || node.subscriptions;
            node.state?.reset();
        }
    
        const unmount = (node: ComponentChild) => {
            if (isDiagramNode(node)) {
                node.children.forEach(x => unmount(x));
                node.cleanups?.cleanupAll();
            }
        }
    
        const renderNode = <P>(node: DiagramNode<P>, prevNode?: DiagramNode<P>, parent?: DiagramNode<any>): DiagramNode<P> => {
            renderContext.currentNode = node;
            initNode(node, prevNode);
            node.parent = parent;
            
            const nodesToRender: {node: DiagramNode<unknown>, prevNode?: DiagramNode<unknown>, parent?: DiagramNode<P>}[] = [];
            if (node.isValid) {
                node.children.forEach(child => {
                    if (isDiagramNode(child)) {
                        nodesToRender.push({node: child, prevNode: child, parent: node});
                    }
                });
            }
            else {
                let children: ComponentChildren;
                const prevChildren = prevNode?.children?.slice();
                if (typeof node.type === 'function') {
                    children = node.type.call(node, node.props);
                }
                else {
                    children = node.props.children;
                }
    
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
    
                prevChildren?.forEach(x => unmount(x));
            }
    
            nodesToRender.forEach(x => renderNode(x.node, x.prevNode, x.parent));
            node.isValid = true;
    
            return node;
        }

        const render = (commitInvalid: boolean = true): SVGGraphicsElement => {
            const rootNode = createElement(App, {
                renderContext,
                diagramRoot: rootComponent,
                diagramRootProps: {svg: root, children: this.elements}
            });
            prevRootNode = renderNode(rootNode, prevRootNode);
            subscription && (subscription.isValid = true);
            renderContext.invokePendingActions();
            renderContext.reset();
            return subscription?.isValid || commitInvalid ? commit(rootNode) : root;
        }

        const clear = () => {
            domBuilder.updateDOM(null);
        }

        const commit = (node: DiagramNode | null): SVGGraphicsElement => {
            return domBuilder.updateDOM(node);
        }

        const attach = () => {
            if (!isAttached) {
                isAttached = true;
                scheduleRender();
                subscription = this.subscribe(() => scheduleRender());
            }
        }

        const detach = (clearDom: boolean) => {
            if (isAttached) {
                isAttached = false;
                if (clearDom) {
                    clear();
                }
                subscription?.unsubscribe();
                subscription = undefined;
            }
        }

        const scheduleRender = () => {
            renderContext.schedule(() => {
                isAttached && render(false);
            });
        }

        return {
            render,
            clear,
            attach,
            detach
        }
    }
}

export class RenderContextType {
    private pendingActions: Array<() => void> = [];
    private unschedule?: () => void;
    private tasks: Array<() => void> = [];
    currentNode?: DiagramNode;

    constructor(public currentDiagram: Diagram) {}

    schedule(task: () => void) {
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

    queue(action: () => void) {
        if (this.isRendering()) {
            this.pendingActions.push(action);
        }
        else {
            this.schedule(() => {
                action();
            });
        }
    }

    reset() {
        this.currentNode = undefined;
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