import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian-diagram/core";
import { InteractionController, withInteractivity } from "@carnelian-diagram/interactivity";
import { 
    InteractiveRoundedRect as RoundedRect,
    InteractiveCircle as Circle 
} from "@carnelian-diagram/shapes/basic";

const root = document.getElementById("root");
if (root && root instanceof SVGGraphicsElement) {
    const diagram = new Diagram();
    diagram.add(RoundedRect, { x: 100, y: 100, width: 200, height: 150, radius: "25%", style: { fill: "yellow" } });
    diagram.add(Circle, { x: 280, y: 220, radius: 80, style: { fill: "blue" }});

    const controller = new InteractionController(diagram);
    const diagramDOM = DiagramDOM.createRoot(diagram, root, withInteractivity(DiagramRoot, controller));

    controller.attach(root);
    diagramDOM.attach();
}