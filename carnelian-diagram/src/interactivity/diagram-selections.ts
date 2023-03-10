import { DiagramNode } from "..";

export class DiagramSelections {
    private selectedElements: Set<DiagramNode> = new Set<DiagramNode>();

    add(element: DiagramNode) {
        this.selectedElements.add(element);
    }

    remove(element: DiagramNode) {
        this.selectedElements.delete(element);
    }

    set(elements: DiagramNode[]) {
        this.selectedElements = new Set<DiagramNode>(elements);
    }

    isSelected(element: DiagramNode): boolean {
        return this.selectedElements.has(element);
    }
}