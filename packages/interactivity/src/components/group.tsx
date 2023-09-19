/** @jsxImportSource @carnelian-diagram/core */

import { Diagram, DiagramElement, DiagramElementNode } from "@carnelian-diagram/core";
import { InteractionContext } from "..";

export interface GroupProps {
    children: DiagramElementNode[];
}

export const Group: DiagramElement<GroupProps> = function(props) {
    return (
        <InteractionContext.Provider value={null}>
            {props.children}
        </InteractionContext.Provider>
    );
}

export function group(diagram: Diagram, elements: DiagramElementNode[]): DiagramElementNode<GroupProps> {
    diagram.delete(elements);
    return diagram.add(Group, { children: elements });
}