/** @jsxImportSource @carnelian-diagram/core */

import { Diagram, DiagramElement, DiagramElementNode } from "@carnelian-diagram/core";
import { ACT_MOVE, Collider, EmptyCollider, HandleControl, InteractionContext, InteractionController, RectCollider, useCollider, useControls } from "..";
import { Rect, unionRects } from "../geometry";

export interface GroupProps {
    children: DiagramElementNode[];
    bounds: Rect | null;
}

export const Group: DiagramElement<GroupProps> = function(props) {
    const { bounds, children } = props;

    function createHandleControl(
        index: number, 
        x: number, y: number
    ) {
        return {
            x, y,
            hitArea: {
                type: "group_corner_handle",
                index,
                cursor: "default"
            }
        }
    }
    
    const collider: Collider<any> = bounds ? RectCollider(bounds) : EmptyCollider();
    useCollider(collider, { type: "in", action: ACT_MOVE, cursor: "move" })

    useControls((transform, element) => {
        const handles = bounds ? [
            createHandleControl(0, bounds.x, bounds.y),
            createHandleControl(1, bounds.x + bounds.width, bounds.y),
            createHandleControl(2, bounds.x, bounds.y + bounds.height),
            createHandleControl(3, bounds.x + bounds.width, bounds.y + bounds.height),
        ] : [];

        return (
            <>
                { handles.map(control => (
                    <HandleControl
                        key={control.hitArea.index}
                        kind="default"
                        x={control.x} y={control.y} hitArea={control.hitArea}
                        transform={transform} 
                        element={element}
                    />
                )) }
            </>
        );
    });

    return (
        <InteractionContext.Provider value={null}>
            {children}
        </InteractionContext.Provider>
    );
}

export function group(diagram: Diagram, controller: InteractionController, elements: DiagramElementNode[]): DiagramElementNode<GroupProps> {
    const boundsArray = elements
        .map(child => controller.getElementBounds(child))
        .filter(rect => !!rect) as Rect[] || [];
    const bounds = unionRects(boundsArray);
    diagram.delete(elements);
    return diagram.add(Group, { children: elements, bounds });
}