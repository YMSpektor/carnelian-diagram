import { Diagram, DiagramElementNode } from "@carnelian-diagram/core";
import { InteractionServive, setElementCursor } from ".";
import { InteractionController } from "../interaction-controller";

export interface DeletionService extends InteractionServive {
    type: "deletion_service";
}

export function isDeletionService(service: DeletionService): service is DeletionService {
    return service.type === "deletion_service";
}

export const DELETE_EVENT = "delete";
export interface DeleteEventArg {
    elements: DiagramElementNode[];
    requestConfirmation(promise: Promise<boolean>): void;
}

export class DefaultDeletionService implements DeletionService {
    private diagram: Diagram | null = null;
    type: "deletion_service" = "deletion_service";
    deactivate?: () => void;

    constructor(private controller: InteractionController) {}
    
    activate(diagram: Diagram, root: HTMLElement) {
        this.diagram = diagram;
        
        const keyDownHandler = (e: KeyboardEvent) => this.keyDownHandler(root, e);
        root.addEventListener("keydown", keyDownHandler);

        this.deactivate = () => {
            this.deactivate = undefined;
            this.diagram = null;
            root.removeEventListener("keydown", keyDownHandler);
        }
    }

    async delete(elements: DiagramElementNode[]): Promise<boolean> {
        if (this.diagram) {
            const promises: Promise<boolean>[] = [];
            this.controller.dispatchEvent<DeleteEventArg>(DELETE_EVENT, {
                elements,
                requestConfirmation: (promise) => {
                    promises.push(promise);
                }
            });

            let confirmations: boolean[];
            try {
                confirmations = await Promise.all(promises);
                if (confirmations.every(x => x)) {
                    this.diagram.delete(elements);
                    this.controller.select([]);
                    return true;
                }
            }
            catch {
                // Rejecting confirmation requests is OK and should not delete the elements
            }
        }
        return false;
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