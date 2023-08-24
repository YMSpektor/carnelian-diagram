import deepcopy from 'deepcopy';
import { Diagram, DiagramElement } from "@carnelian-diagram/core";
import { InteractionServive } from ".";
import { ACT_COPY, ACT_COPY_Payload, ACT_PASTE, ACT_PASTE_Payload, InteractionController } from "..";
import { DiagramElementNode } from '@carnelian-diagram/core';

export interface ClipboardService extends InteractionServive {
    type: "clipboard_service";
    offsetXOnPaste: number;
    offsetYOnPaste: number;
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
    relativeOffset: DOMPointReadOnly;
}

export class DefaultClipboardService implements ClipboardService {
    private diagram: Diagram | null = null;
    private copiedElements: ClipboardElementData<any>[] = [];
    private pasteIndex = 0;
    type: "clipboard_service" = "clipboard_service";
    offsetXOnPaste = 0;
    offsetYOnPaste = 0;
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
            const selectedElements = this.controller.getSelectedElements();
            this.controller.dispatchAction<ACT_COPY_Payload>(selectedElements, ACT_COPY, {
                controller: this.controller
            });
            this.copiedElements = selectedElements.map(x => ({
                type: x.type,
                props: deepcopy(x.props),
                relativeOffset: this.controller.diagramToElement(new DOMPoint(this.offsetXOnPaste, this.offsetYOnPaste), x)
            }));
            this.pasteIndex = 0;
        }
    }

    paste() {
        if (this.canPaste()) {
            this.pasteIndex++;
            const newElements: DiagramElementNode[] = [];
            this.copiedElements.forEach(x => {
                if (this.diagram) {
                    const element = this.diagram.add(x.type, x.props);
                    newElements.push(element);
                    const offsetX = x.relativeOffset.x * this.pasteIndex;
                    const offsetY = x.relativeOffset.y * this.pasteIndex;
                    this.controller.dispatchAction<ACT_PASTE_Payload>([element], ACT_PASTE, {
                        controller: this.controller,
                        offsetX,
                        offsetY
                    });
                }
            });
            this.controller.select(newElements);
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