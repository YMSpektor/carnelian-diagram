import { createProperties, diff, patch, VChild, VNode, VTree } from "virtual-dom";
import { Root } from "./components/root";
import { ComponentState, RenderControlsCallback } from "./hooks";
import { ComponentChildren, createElement, FunctionComponent, VirtualNode } from "./jsx-runtime";

type HyperscriptChild = undefined | null | VChild | HyperscriptChild[];
type Hyperscript = (tagName: string, properties: createProperties, children: HyperscriptChild) => VNode;

export const h: Hyperscript = require("virtual-dom/h");
export const svg: Hyperscript = require("virtual-dom/virtual-hyperscript/svg");

export type DiagramElement<P> = FunctionComponent<P>;

export interface DiagramComponentData {
    parent?: DiagramNode;
    state?: ComponentState;
    renderControlsCallback?: RenderControlsCallback;
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

export class Diagram {
    private isValid = false;
    private idleCallbackId?: Schedule;
    private elements: DiagramNode[] = [];
    private lastTree: VTree;
    private rootState: ComponentState;

    constructor() {
        this.lastTree = h("", {}, []);
        this.rootState = new ComponentState(); // Temporary, until reconsiliation is implemented
    }

    private createElementNode<P extends {}>(type: DiagramElement<P>, props: P, state?: ComponentState): DiagramNode<P> {
        const element = createElement<P, DiagramComponentData>(type, props);
        element.data = {
            state: state || new ComponentState()
        };
        return element;
    }

    private renderVirtual(node: DiagramNode): HyperscriptChild {
        renderContext.currentNode = node;
        node.data = node.data || {};
        node.data.state?.reset();
        node.data.renderControlsCallback = undefined;

        const createVDomNode = (child: ComponentChildren<any, DiagramComponentData>): HyperscriptChild => {
            if (Array.isArray(child)) {
                return child.map(createVDomNode);
            }
            if (child && typeof child === 'object') {
                if (child.data) {
                    child.data.parent = node;
                }
                return this.renderVirtual(child);
            }
            else {
                return child;
            }
        }

        if (typeof node.type === 'string') {
            const { children, ...properties } = node.props;
            const childrenNodes = Array.isArray(children) ? children : [children];
            return svg(node.type, properties, childrenNodes.map(createVDomNode));
        }
        else {
            const result = node.type(node.props);
            return createVDomNode(result);
        }
    }

    private applyAllEffects() {
        renderContext.currentDiagram = this;
        renderContext.applyIdleEffects();
        renderContext.applyEffects();
        renderContext.reset();
    }

    update(root: SVGGraphicsElement): SVGGraphicsElement {
        renderContext.currentDiagram = this;
        renderContext.idleEffects = [];
        const rootNode = this.renderVirtual(this.createElementNode(Root, {svg: root, children: this.elements}, this.rootState));
        const tree = h("", {}, rootNode);
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        const result = patch(root, patches);
        this.lastTree = tree;
        this.isValid = true;
        this.applyAllEffects();
        return result;
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
    effects: Array<() => void> = [];
    idleEffects: Array<() => void> = [];

    reset() {
        this.currentDiagram = null;
        this.currentNode = null;
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