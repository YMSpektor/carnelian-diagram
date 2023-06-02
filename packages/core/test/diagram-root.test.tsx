/** @jsxImportSource ../src */

import { Diagram, DiagramRootRenderer, DiagramDOM, DiagramRoot } from "../src";

interface TestElementProps {
    cx: number;
    cy: number;
    r: number;
}

const TestElement = (props: TestElementProps) => {
    return (
        <circle id="test_element" cx={props.cx} cy={props.cy} r={props.r} />
    );
}

describe("Diagram root tests", () => {
    let diagram: Diagram;
    let root: DiagramRootRenderer;

    beforeEach(() => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.replaceChildren(svg);
        diagram = new Diagram();
        root = DiagramDOM.createRoot(diagram, svg, DiagramRoot);
    });

    test("Initial isValid should be false", () => {
        expect(root.isValid()).toEqual(false);
    });

    test("isValid should be true after rendering", () => {
        root.render();

        expect(root.isValid()).toEqual(true);
    });

    test("Added element is found in the DOM", () => {
        diagram.add(TestElement, { cx: 20, cy: 20, r: 10 });
        root.render();

        const element = document.getElementById("test_element");

        expect(element).toBeTruthy();
    });

    test("Added element has correct tagName and attributes", () => {
        const props = { cx: 20, cy: 20, r: 10 };
        diagram.add(TestElement, props);
        root.render();

        const element = document.getElementById("test_element");

        expect(element?.tagName).toEqual("circle");
        expect(element?.getAttribute("cx")).toEqual(props.cx.toString());
        expect(element?.getAttribute("cy")).toEqual(props.cy.toString());
        expect(element?.getAttribute("r")).toEqual(props.r.toString());
    });
});