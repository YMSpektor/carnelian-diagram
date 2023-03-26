import { Diagram, DiagramRoot } from "carnelian-diagram";
import { InteractionController, withInteraction } from "carnelian-diagram/interaction";
import { Rect } from "./elements/rect";

export const controller = new InteractionController();
export const diagram = new Diagram(
    withInteraction(
        DiagramRoot, 
        controller
    )
);

diagram.add(Rect, {x: 300, y: 150, width: 400, height: 300, stroke: 'black', fill: 'white'});
diagram.add(Rect, {x: 400, y: 200, width: 400, height: 300, stroke: 'black', fill: 'blue'});
