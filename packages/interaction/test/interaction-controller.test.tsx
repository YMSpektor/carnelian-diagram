/** @jsxImportSource @carnelian-diagram/core */

import "./polyfills";
import { Diagram, DiagramRootRenderer, DiagramDOM, DiagramRoot } from "@carnelian-diagram/core";
import { InteractionController, withInteraction, withInteractiveRect } from "../src";

interface TestElementProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

const TestElement = withInteractiveRect((props: TestElementProps) => {
    return (
        <rect id="test_element" {...props} />
    );
});

describe("InteactionController tests", () => {
    let svg: SVGSVGElement;
    let diagram: Diagram;
    let controller: InteractionController;
    let root: DiagramRootRenderer;

    beforeEach(() => {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.replaceChildren(svg);
        diagram = new Diagram();
        controller = new InteractionController(diagram);
        root = DiagramDOM.createRoot(diagram, svg, withInteraction(DiagramRoot, controller));

        controller.attach(svg);
    });

    test("Element must be selected after clicking", () => {
        const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
        root.render();

        let clientPos = controller.diagramToClient(new DOMPoint(0, 0));
        let event = new window.PointerEvent("pointerdown", {
            button: 0,
            clientX: clientPos.x,
            clientY: clientPos.y
        });
        svg.dispatchEvent(event);
        root.render();

        expect(controller.isSelected(element)).toEqual(true);
    });
});