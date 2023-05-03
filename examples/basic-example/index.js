"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var diagram_1 = require("@carnelian/diagram");
var interaction_1 = require("@carnelian/interaction");
var basic_1 = require("@carnelian/shapes/basic");
var root = document.getElementById("root");
if (root && root instanceof SVGGraphicsElement) {
    var diagram = new diagram_1.Diagram();
    diagram.add(basic_1.InteractiveRoundedRect, { x: 100, y: 100, width: 200, height: 100, radius: "25%", style: { fill: "yellow" } });
    diagram.add(basic_1.InteractiveCircle, { x: 280, y: 220, radius: 80, style: { fill: "blue" } });
    var controller = new interaction_1.InteractionController(diagram);
    var diagramDOM = diagram_1.DiagramDOM.createRoot(diagram, root, (0, interaction_1.withInteraction)(diagram_1.DiagramRoot, controller));
    controller.attach(root);
    diagramDOM.attach();
}
