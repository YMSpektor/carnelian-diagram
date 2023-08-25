import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian-diagram/core";
import { InteractionController, withInteraction } from "@carnelian-diagram/interactivity";
import { InteractiveCustomElement as CustomElement } from "./custom-element";

const root = document.getElementById("root");
if (root && root instanceof SVGGraphicsElement) {
    const diagram = new Diagram();
    diagram.add(CustomElement, { x: 100, y: 100, width: 200, height: 150 });

    const controller = new InteractionController(diagram);
    const diagramDOM = DiagramDOM.createRoot(diagram, root, withInteraction(DiagramRoot, controller));

    controller.attach(root);
    diagramDOM.attach();
}