import { Diagram, DiagramRoot } from "carnelian-diagram";
import { InteractionController, withInteractions } from "carnelian-diagram/interactions";
import { Rect } from "./elements/rect";

const doc = new Diagram(
    withInteractions(
        DiagramRoot, 
        new InteractionController()
    )
);
doc.add(Rect, {x: 150, y: 80, width: 200, height: 140, stroke: 'black', fill: 'white'});
doc.add(Rect, {x: 200, y: 100, width: 200, height: 140, stroke: 'black', fill: 'blue'});

export default doc;