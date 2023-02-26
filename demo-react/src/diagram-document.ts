import { DiagramDocument } from "carnelian-diagram";
import { Rect } from "./diagram/rect";

const doc = new DiagramDocument();
doc.add(Rect, {x: 200, y: 100, width: 200, height: 140, stroke: 'black', fill: 'blue'});

export default doc;