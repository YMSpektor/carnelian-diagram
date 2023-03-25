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
doc.add(Rect, {x: 300, y: 150, width: 400, height: 300, stroke: 'black', fill: 'white'});
doc.add(Rect, {x: 400, y: 200, width: 400, height: 300, stroke: 'black', fill: 'blue'});

export default doc;