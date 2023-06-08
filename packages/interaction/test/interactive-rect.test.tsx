/** @jsxImportSource @carnelian-diagram/core */

import "./polyfills";
import { Diagram, DiagramRootRenderer, DiagramDOM, DiagramRoot, DiagramElementNode } from "@carnelian-diagram/core";
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

describe("Inteactive rect tests", () => {
    let svg: SVGSVGElement;
    let diagram: Diagram;
    let controller: InteractionController;
    let root: DiagramRootRenderer;

    beforeAll(() => {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.replaceChildren(svg);
        diagram = new Diagram();
        controller = new InteractionController(diagram);
        root = DiagramDOM.createRoot(diagram, svg, withInteraction(DiagramRoot, controller));

        controller.attach(svg);
    });

    describe("Action tests", () => {
        let element: DiagramElementNode;
        
        beforeEach(() => {
            element = diagram.add(TestElement, { x: 0, y: 0, width: 100, height: 50 });
            root.render();

            let clientPos = controller.diagramToClient(new DOMPoint(10, 10));
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
        });

        afterEach(() => {
            diagram.delete(element);
            root.render();
        });

        test("Resize top-left", () => {
            const handle = document.getElementsByClassName("control-handle-default").item(0)!;
            expect(handle).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(0, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(10, 10));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 10, y: 10, width: 90, height: 40 });
        });

        test("Resize top-right", () => {
            const handle = document.getElementsByClassName("control-handle-default").item(1)!;
            expect(handle).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(100, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(90, 10));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 0, y: 10, width: 90, height: 40 });
        });

        test("Resize bottom-left", () => {
            const handle = document.getElementsByClassName("control-handle-default").item(2)!;
            expect(handle).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(0, 50));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(10, 40));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 10, y: 0, width: 90, height: 40 });
        });

        test("Resize bottom-right", () => {
            const handle = document.getElementsByClassName("control-handle-default").item(3)!;
            expect(handle).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(100, 50));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(90, 40));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            handle.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 0, y: 0, width: 90, height: 40 });
        });

        test("Resize left", () => {
            const edge = document.getElementsByClassName("control-edge-default").item(0)!;
            expect(edge).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(0, 10));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(10, 10));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 10, y: 0, width: 90, height: 50 });
        });

        test("Resize top", () => {
            const edge = document.getElementsByClassName("control-edge-default").item(1)!;
            expect(edge).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(10, 0));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(10, 10));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 0, y: 10, width: 100, height: 40 });
        });

        test("Resize right", () => {
            const edge = document.getElementsByClassName("control-edge-default").item(2)!;
            expect(edge).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(100, 10));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(90, 10));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 0, y: 0, width: 90, height: 50 });
        });

        test("Resize bottom", () => {
            const edge = document.getElementsByClassName("control-edge-default").item(3)!;
            expect(edge).toBeTruthy();

            let clientPos = controller.diagramToClient(new DOMPoint(10, 50));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(10, 40));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            edge.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 0, y: 0, width: 100, height: 40 });
        });

        test("Move", () => {
            let clientPos = controller.diagramToClient(new DOMPoint(10, 10));
            let event = new PointerEvent("pointerdown", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            svg.dispatchEvent(event);
            clientPos = controller.diagramToClient(new DOMPoint(20, 20));
            event = new PointerEvent("pointermove", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            svg.dispatchEvent(event);
            event = new PointerEvent("pointerup", {
                button: 0,
                clientX: clientPos.x,
                clientY: clientPos.y,
                bubbles: true
            });
            svg.dispatchEvent(event);
            root.render();

            expect(element.props).toMatchObject({ x: 10, y: 10, width: 100, height: 50 });
        });
    });
});