import { Diagram, DiagramRoot } from "carnelian-diagram";
import { InteractionController, withInteraction } from "carnelian-diagram/interaction";
import { Rect } from "./elements/rect";

const controller = new InteractionController();
const doc = new Diagram(
    withInteraction(
        DiagramRoot, 
        controller
    )
);
doc.add(Rect, {x: 150, y: 80, width: 200, height: 140, stroke: 'black', fill: 'white'});
doc.add(Rect, {x: 200, y: 100, width: 200, height: 140, stroke: 'black', fill: 'blue'});

export default doc;