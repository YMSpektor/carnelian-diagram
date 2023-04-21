import { Diagram, DiagramElementNode } from "@carnelian/diagram";
import { InteractionServive, setElementCursor } from ".";
import { InteractionController } from "../interaction-controller";

export interface DeletionService extends InteractionServive {
    type: "deletion_service";
}

export function isDeletionService(service: DeletionService): service is DeletionService {
    return service.type === "deletion_service";
}

export class DefaultDeletionService implements DeletionService {
    type: "deletion_service" = "deletion_service";
    release?: () => void;

    constructor(private controller: InteractionController) {}
    
    init(diagram: Diagram, root: HTMLElement) {
        const keyDownHandler = (e: KeyboardEvent) => this.keyDownHandler(root, e);
        root.addEventListener("keydown", keyDownHandler);

        this.release = () => {
            this.release = undefined;
            root.removeEventListener("keydown", keyDownHandler);
        }
    }

    delete(elements: DiagramElementNode[]) {
        return this.controller.delete(elements);
    }

    private async keyDownHandler(root: HTMLElement, e: KeyboardEvent) {
        // Firefox 36 and earlier uses "Del" instead of "Delete" for the Del key
        // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
        const selectedElements = this.controller.getSelectedElements();
        if ((e.key === "Delete" || e.key === "Del") && selectedElements.length) {
            const result = await this.delete(selectedElements);
            if (result) {
                setElementCursor(root, null);
            }
        }
    }
}