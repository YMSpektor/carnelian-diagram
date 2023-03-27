import { Diagram, DiagramRoot } from "carnelian-diagram";
import { InteractionController, withInteraction } from "carnelian-diagram/interaction";

export const controller = new InteractionController();
export const diagram = new Diagram(
    withInteraction(
        DiagramRoot, 
        controller
    )
);
