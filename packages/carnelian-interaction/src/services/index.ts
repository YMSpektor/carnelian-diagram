import { Diagram } from "@carnelian/diagram";

export interface InteractionServive {
    type: string;
    activate?: (diagram: Diagram, root: HTMLElement) => void;
    deactivate?: () => void;
}

export class InteractiveServiceCollection {
    constructor(private services: InteractionServive[]) {}

    configure<T extends InteractionServive>(
        predicate: (service: InteractionServive) => service is T, 
        configure: (service: T) => void
    ) {
        const service = this.services.find(predicate);
        if (service) {
            configure(service);
        }
    }

    push(service: InteractionServive) {
        this.services.push(service);
    }

    unshift(service: InteractionServive) {
        this.services.unshift(service);
    }

    insert(position: number, service: InteractionServive) {
        this.services.splice(position, 0, service);
    }

    remove<T extends InteractionServive>(predicate: (service: InteractionServive) => service is T) {
        const index = this.findIndex(predicate);
        if (index >= 0) {
            this.services.splice(index, 1);
        }
    }

    removeAt(index: number) {
        this.services.splice(index, 1);
    }

    replace<T extends InteractionServive>(predicate: (service: InteractionServive) => service is T, service: InteractionServive) {
        const index = this.findIndex(predicate);
        if (index >= 0) {
            this.services[index] = service;
        }
    }

    find<T extends InteractionServive>(predicate: (service: InteractionServive) => service is T) {
        return this.services.find(predicate);
    }

    findIndex<T extends InteractionServive>(predicate: (service: InteractionServive) => service is T) {
        return this.services.findIndex(predicate);
    }

    toArray(): InteractionServive[] {
        return [...this.services];
    }
}

export function setElementCursor(element: HTMLElement, cursor?: string | null) {
    if (cursor) {
        element.style.cursor = cursor;
    }
    else {
        element.style.removeProperty("cursor");
    }
}

export * from "./selection-service";
export * from "./element-interaction-service";
export * from "./grid-snapping-service";
export * from "./deletion-service";
export * from "./element-drawing-service";
export * from "./control-rendering-service";
export * from "./paper-service";