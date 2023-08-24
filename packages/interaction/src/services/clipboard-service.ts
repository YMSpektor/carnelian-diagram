import deepcopy from 'deepcopy';
import { Diagram, DiagramElement } from "@carnelian-diagram/core";
import { InteractionServive } from ".";
import { InteractionController } from "..";
import { DiagramElementNode } from '@carnelian-diagram/core';

export interface ClipboardService extends InteractionServive {
    type: "clipboard_service";
    canCopy(): boolean;
    canPaste(): boolean;
    copy(): void;
    paste(): void;
}

export function isClipboardService(service: InteractionServive): service is ClipboardService {
    return service.type === "clipboard_service";
}

interface ClipboardElementData<P extends object> {
    type: DiagramElement<P>;
    props: P;
}

export class DefaultClipboardService implements ClipboardService {
    private diagram: Diagram | null = null;
    private copiedElements: ClipboardElementData<any>[] = [];
    type: "clipboard_service" = "clipboard_service";
    deactivate?: () => void;

    constructor(private controller: InteractionController) {}

    activate(diagram: Diagram, root: HTMLElement) {
        this.diagram = diagram;
        
        const keyDownHandler = (e: KeyboardEvent) => this.keyDownHandler(root, e);
        root.addEventListener("keydown", keyDownHandler);

        this.deactivate = () => {
            this.diagram = null;
            this.deactivate = undefined;
            root.removeEventListener("keydown", keyDownHandler);
        }
    }

    canCopy(): boolean {
        const selected = this.controller.getSelectedElements();
        return !!this.diagram && !!selected.length;
    }

    canPaste(): boolean {
        return !!this.diagram && !!this.copiedElements.length;
    }

    copy() {
        if (this.canCopy()) {
            this.copiedElements = this.controller.getSelectedElements().map(x => ({
                type: x.type,
                props: deepcopy(x.props)
            }));
        }
    }

    paste() {
        if (this.canPaste()) {
            const newElements: DiagramElementNode[] = [];
            this.copiedElements.forEach(x => {
                if (this.diagram) {
                    const element = this.diagram.add(x.type, x.props);  // TODO: offset element
                    newElements.push(element);
                }
            });
            this.controller.select(newElements)
        }
    }

    private keyDownHandler(root: HTMLElement, e: KeyboardEvent) {
        const ctrl = e.ctrlKey || e.metaKey;
        if (ctrl && e.key === "c") {
            this.copy();
        }
        if (ctrl && e.key === "v") {
            this.paste();
        }
    }
}