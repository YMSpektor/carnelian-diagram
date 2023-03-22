import { Diagram } from "carnelian-diagram";
import { InteractiveDiagramRoot } from "carnelian-diagram/interactivity";
import { Rect } from "./diagram/rect";

const doc = new Diagram(InteractiveDiagramRoot);
doc.add(Rect, {x: 200, y: 100, width: 200, height: 140, stroke: 'black', fill: 'blue'});

export default doc;