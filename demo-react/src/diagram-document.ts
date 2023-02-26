import { DiagramDocument } from "carnelian-diagram";
import { Line } from "./diagram/line";

const doc = new DiagramDocument();
doc.add(Line, {x1: 0, y1: 10, x2: 100, y2: 10, stroke: 'black'});

export default doc;