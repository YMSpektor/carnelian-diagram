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
import { DOMBuilder } from "./dom-builder";
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

export class Diagram {
    private lastElementId = 0;
    private elements: DiagramElementNode[] = [];
    private isValid = false;
    private subscriptions: Array<() => void> = [];

    private createElementNode<P extends object>(type: DiagramElement<P>, props: P, key: Key): DiagramElementNode<P> {
        const onChange = (callback: (oldProps: DiagramElementProps<P>) => DiagramElementProps<P>) => {
            this.update(element, callback(element.props));
        }
        const element = createElement(type, {...props, onChange}, key);
        return element;
    }

    isInvalid(): boolean {
        return !this.isValid;
    }

    invalidate(node?: DiagramNode) {
        if (node) {
            node.isValid = false;
        }
        if (this.isValid) {
            this.isValid = false;
            this.subscriptions.forEach(cb => cb());
        }
    }

    validate() {
        this.isValid = true;
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

    subscribe(callback: () => void) {
        this.subscriptions.push(callback);
        return () => {
            this.subscriptions = this.subscriptions.filter(x => x !== callback);
        }
    }
}

export class DiagramDOM {
    private domBuilder: DOMBuilder;
    private renderContext: RenderContextType;
    private unsubscribe?: () => void;
    private prevRootNode?: DiagramNode;

    constructor(
        private diagram: Diagram, 
        private root: SVGGraphicsElement, 
        private diagramRoot: DiagramRootComponent
    ) {
        this.domBuilder = new DOMBuilder();
        this.renderContext = new RenderContextType(diagram);
    }

    private initNode<P>(node: DiagramNode<P>, prevNode?: DiagramNode<P>) {
        node.state = prevNode?.state || node.state;
        node.cleanups = prevNode?.cleanups || node.cleanups;
        node.context = node.context || prevNode?.context;
        node.contextValue = node.contextValue || prevNode?.contextValue;
        node.subscriptions = prevNode?.subscriptions || node.subscriptions;
        node.state?.reset();
    }

    private unmount(node: ComponentChild) {
        if (isDiagramNode(node)) {
            node.children.forEach(x => this.unmount(x));
            node.cleanups?.cleanupAll();
        }
    }

    private renderNode<P>(node: DiagramNode<P>, prevNode?: DiagramNode<P>, parent?: DiagramNode<any>): DiagramNode<P> {
        this.renderContext.currentNode = node;
        this.initNode(node, prevNode);
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

            prevChildren?.forEach(x => this.unmount(x));
        }

        nodesToRender.forEach(x => this.renderNode(x.node, x.prevNode, x.parent));
        node.isValid = true;

        return node;
    }

    private commit(rootNode: DiagramNode | null): SVGGraphicsElement {
        return this.domBuilder.updateDOM(this.root, rootNode);
    }

    private scheduleRender() {
        this.renderContext.schedule(() => {
            this.render(false);
        });
    }

    render(commitInvalid: boolean = true) {
        const rootNode = createElement(App, {
            renderContext: this.renderContext,
            diagramRoot: this.diagramRoot,
            diagramRootProps: {svg: this.root, children: this.diagram.getElements()}
        });
        this.prevRootNode = this.renderNode(rootNode, this.prevRootNode);
        this.diagram.validate();
        this.renderContext.invokePendingActions();
        this.renderContext.reset();
        return commitInvalid || !this.diagram.isInvalid() ? this.commit(rootNode) : this.root;
    }

    clear() {
        this.commit(null);
    }

    attach() {
        this.scheduleRender();
        this.unsubscribe = this.diagram.subscribe(() => this.scheduleRender());
    }

    detach(clearDom: boolean) {
        if (clearDom) {
            this.clear();
        }
        this.unsubscribe?.();
    }
}

export class RenderContextType {
    private pendingActions: Array<() => void> = [];
    private unschedule?: () => void;
    private tasks: Array<() => void> = [];
    currentNode?: DiagramNode;

    constructor(public currentDiagram: Diagram) {}

    reset() {
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

    private isRendering(): boolean {
        return !!this.currentNode;
    }

    schedule(action: () => void) {
        if (this.isRendering()) {
            this.queue(action);
        }
        else {
            this.scheduleTask(() => {
                action();
            });
        }
    }
}

export const RenderContext = createContext<RenderContextType | undefined>(undefined);