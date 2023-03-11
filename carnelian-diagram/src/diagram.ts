import { DOMBuilder } from "./dom";
import { ComponentState } from "./hooks";
import { ComponentChild, ComponentChildren, createElement, FunctionComponent, VirtualNode } from "./jsx-runtime";

export type DiagramElement<P> = FunctionComponent<P>;

export interface DiagramRootProps {
    svg: SVGGraphicsElement;
    children: DiagramNode[];
}

export type DiagramRoot<P extends DiagramRootProps> = FunctionComponent<P>;

export interface DiagramComponentData {
    parent?: DiagramNode;
    children: ComponentChild[];
    state?: ComponentState;
    context?: Context<any>;
    contextValue?: any;
}

export type DiagramNode<P = any> = VirtualNode<P, DiagramComponentData>;

type Schedule = any;

const schedule = (callback: () => void): Schedule => {
    const fn = typeof requestIdleCallback !== 'undefined' ? requestIdleCallback : setImmediate;
    return fn(callback);
};

const cancelSchedule = (schedule: Schedule): void => {
    const fn = typeof cancelIdleCallback !== 'undefined' ? cancelIdleCallback : clearImmediate;
    fn(schedule);
};

export interface ContextProviderProps<T> {
    value: T;
    children?: JSX.Element;
}

export interface ContextConsumerProps<T> {
    children?: (value: T) => JSX.Element;
}

export class Context<T> {
    private defaultValue: T;

    constructor(defaultValue: T) {
        this.defaultValue = defaultValue;
    }

    Provider = (props: ContextProviderProps<T>): JSX.Element => {
        this.currentValue = props.value;
        return props.children;
    }

    Consumer = (props: ContextConsumerProps<T>): JSX.Element => {
        return props.children?.(this.currentValue);
    }

    get currentValue(): T {
        let node: DiagramNode | null = renderContext.currentNode;
        while (node && node.data?.context !== this) {
            node = node.data?.parent || null;
        }
        return node?.data?.contextValue || this.defaultValue;
    }

    set currentValue(newValue: T) {
        if (renderContext.currentNode?.data) {
            renderContext.currentNode.data.context = this;
            renderContext.currentNode.data.contextValue = newValue;
        }
    }
}

export function createContext<T>(defaultValue: T) {
    return new Context<T>(defaultValue);
}

export class Diagram {
    private isValid = false;
    private idleCallbackId?: Schedule;
    private elements: DiagramNode[] = [];
    private domBuilder = new DOMBuilder();
    private rootState: ComponentState;

    constructor(private rootComponent: DiagramRoot<DiagramRootProps>) {
        this.rootState = new ComponentState(); // Temporary, until reconsiliation is implemented
    }

    private createElementNode<P extends {}>(type: DiagramElement<P>, props: P, state?: ComponentState): DiagramNode<P> {
        const element = createElement<P, DiagramComponentData>(type, props);
        element.data = {
            state: state || new ComponentState(),
            children: []
        };
        return element;
    }

    private renderNode(node: DiagramNode, parent: DiagramNode | undefined = undefined): DiagramNode {
        renderContext.currentNode = node;
        renderContext.currentElement = null;
        node.data = node.data || { children: [] };
        node.data.state?.reset();
        node.data.parent = parent;
        let curNode: DiagramNode | undefined = node;
        while (curNode && !renderContext.currentElement) {
            if (this.elements.indexOf(curNode) >= 0) {
                renderContext.currentElement = curNode;
            }
            curNode = curNode.data?.parent;
        }
        const nodeData = node.data;
        let children: ComponentChildren;

        if (typeof node.type === 'function') {
            children = node.type(node.props);
        }
        else {
            children = node.props.children;
        }

        if (children) {
            if (Array.isArray(children)) {
                nodeData.children = children;
            }
            else {
                nodeData.children = [children];
            }
        }
        else {
            nodeData.children = [];
        }

        nodeData.children.forEach(child => {
            if (child && typeof child === 'object') {
                this.renderNode(child, node);
            }
        });

        return node;
    }

    private applyAllEffects() {
        renderContext.currentDiagram = this;
        renderContext.applyIdleEffects();
        renderContext.applyEffects();
        renderContext.reset();
    }

    private commit(root: SVGGraphicsElement, rootNode: DiagramNode): SVGGraphicsElement {
        return this.domBuilder.updateDOM(root, rootNode);
    }

    update(root: SVGGraphicsElement): SVGGraphicsElement {
        renderContext.currentDiagram = this;
        renderContext.idleEffects = [];
        const rootNode = this.renderNode(
            this.createElementNode(this.rootComponent, {svg: root, children: this.elements}, this.rootState)
        );
        this.isValid = true;
        this.applyAllEffects();
        return this.commit(root, rootNode);
    }

    invalidate() {
        this.isValid = false;
    }

    attach(root: SVGGraphicsElement) {
        const workloop = () => {
            if (!this.isValid) {
                this.update(root);
            }
            else {
                this.applyAllEffects();
            }     

            this.idleCallbackId = schedule!(workloop);
        }

        this.idleCallbackId = schedule!(workloop);
    }

    detach() {
        this.idleCallbackId && cancelSchedule!(this.idleCallbackId);
    }

    add<P extends {}>(type: DiagramElement<P>, props: P): DiagramNode<P> {
        const element = this.createElementNode(type, props);
        this.elements.push(element);
        this.invalidate();
        return element;
    }
}

class RenderContext {
    currentDiagram: Diagram | null = null;
    currentNode: DiagramNode | null = null;
    currentElement: DiagramNode | null = null;
    effects: Array<() => void> = [];
    idleEffects: Array<() => void> = [];

    reset() {
        this.currentDiagram = null;
        this.currentNode = null;
        this.currentElement = null;
        this.effects = [];
    }

    applyIdleEffects() {
        this.idleEffects.forEach(effect => effect());
    }

    applyEffects() {
        this.effects.forEach(effect => effect());
    }
}

export const renderContext = new RenderContext();