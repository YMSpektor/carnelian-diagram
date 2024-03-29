/** @jsxImportSource @carnelian-diagram/core */

import "./polyfills";
import { Diagram, DiagramRootRenderer, DiagramDOM, DiagramRoot } from "@carnelian-diagram/core";
import { InteractionController, withInteractivity, withInteractiveRect } from "../src";

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
        root = DiagramDOM.createRoot(diagram, svg, withInteractivity(DiagramRoot, controller));

        controller.attach(svg);
    });

    describe("Selection tests", () => {
        test("Element must be selected after clicking", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            expect(controller.isSelected(element)).toEqual(false);
    
            let clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();
    
            expect(controller.isSelected(element)).toEqual(true);
        });

        test("Element must be deselected after clicking outside", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            expect(controller.isSelected(element)).toEqual(false);
    
            let clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();
    
            expect(controller.isSelected(element)).toEqual(true);

            clientPos = controller.diagramToClient(new DOMPoint(200, 200));
            event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();

            expect(controller.isSelected(element)).toEqual(false);
        });

        test("Element must not be deselected after clicking inside", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            expect(controller.isSelected(element)).toEqual(false);
    
            let clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();
    
            expect(controller.isSelected(element)).toEqual(true);

            clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();

            expect(controller.isSelected(element)).toEqual(true);
        });

        test("Selecting with Shift key must select two elements", () => {
            const element1 = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            const element2 = diagram.add(TestElement, { x: 20, y: 20, width: 100, height: 50 });
            root.render();

            expect(controller.isSelected(element1)).toEqual(false);
            expect(controller.isSelected(element2)).toEqual(false);
    
            let clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                shiftKey: true,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();
    
            expect(controller.isSelected(element1)).toEqual(true);
            expect(controller.isSelected(element2)).toEqual(false);

            clientPos = controller.diagramToClient(new DOMPoint(20, 20));
            event = new PointerEvent("pointerdown", {
                button: 0,
                shiftKey: true,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();
    
            expect(controller.isSelected(element1)).toEqual(true);
            expect(controller.isSelected(element2)).toEqual(true);
        });

        test("Clicking with Shift key must toggle selection", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            expect(controller.isSelected(element)).toEqual(false);
    
            let clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                shiftKey: true,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();
    
            expect(controller.isSelected(element)).toEqual(true);

            clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            event = new PointerEvent("pointerdown", {
                button: 0,
                shiftKey: true,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();

            expect(controller.isSelected(element)).toEqual(false);
        });

        test("Selection rect must select all elements inside", () => {
            const element1 = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            const element2 = diagram.add(TestElement, { x: 20, y: 20, width: 100, height: 50 });
            root.render();

            expect(controller.isSelected(element1)).toEqual(false);
            expect(controller.isSelected(element2)).toEqual(false);
    
            let clientPos = controller.diagramToClient(new DOMPoint(200, 200));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();
    
            expect(controller.isSelected(element1)).toEqual(true);
            expect(controller.isSelected(element2)).toEqual(true);
        });
    });

    describe("Hit tesing tests", () => {
        test("Tesing outside", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            let clientPos = controller.diagramToClient(new DOMPoint(200, 200));
            let event = new PointerEvent("pointermove", {
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);

            const hitInfo = controller.hitTest(event);
            expect(hitInfo).toBeUndefined();
        });

        test("Tesing inner area", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            let clientPos = controller.diagramToClient(new DOMPoint(10, 10));
            let event = new PointerEvent("pointermove", {
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);

            const hitInfo = controller.hitTest(event);
            expect(hitInfo?.hitArea?.type).toEqual("in");
        });

        test("Tesing resize handle", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            let clientPos = controller.diagramToClient(new DOMPoint(10, 10));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();

            clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            event = new PointerEvent("pointermove", {
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            const handle = document.getElementsByClassName("control-handle-default").item(0);
            handle?.dispatchEvent(event);

            const hitInfo = controller.hitTest(event); 
            expect(hitInfo?.hitArea).toMatchObject({ type: "resize_handle", index: 0 });
        });

        test("Tesing resize edge", () => {
            const element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            let clientPos = controller.diagramToClient(new DOMPoint(10, 10));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);
            root.render();

            clientPos = controller.diagramToClient(new DOMPoint(0, 10));
            event = new PointerEvent("pointermove", {
                clientX: clientPos.x,
                clientY: clientPos.y
            });
            svg.dispatchEvent(event);

            const hitInfo = controller.hitTest(event);
            expect(hitInfo?.hitArea).toMatchObject({ type: "resize_edge", index: 0 });
        });
    });
});