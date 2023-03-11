import { Diagram } from "carnelian-diagram";
import { Root } from "carnelian-diagram/components/root";
import { Rect } from "./diagram/rect";

const doc = new Diagram(Root);
doc.add(Rect, {x: 200, y: 100, width: 200, height: 140, stroke: 'black', fill: 'blue'});

export default doc;