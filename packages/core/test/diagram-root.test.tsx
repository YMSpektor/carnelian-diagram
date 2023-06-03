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

    describe("isValid", () => {
        test("Initial isValid should be false", () => {
            expect(root.isValid()).toEqual(false);
        });
    
        test("isValid should be true after rendering", () => {
            root.render();
    
            expect(root.isValid()).toEqual(true);
        });
    
        test("isValid should be false after adding a new element", () => {
            root.render();
            expect(root.isValid()).toEqual(true);
    
            diagram.add(TestElement, { cx: 20, cy: 20, r: 10 });
            expect(root.isValid()).toEqual(false);
        });
    
        test("isValid should be false after updating the element", () => {
            const element = diagram.add(TestElement, { cx: 20, cy: 20, r: 10 });
            root.render();
            expect(root.isValid()).toEqual(true);
    
            diagram.update(element, {...element.props});
            expect(root.isValid()).toEqual(false);
        });

        test("Invalidating diagram should set isValid of root to false", () => {
            root.render();
            expect(root.isValid()).toEqual(true);
    
            diagram.invalidate();
            expect(root.isValid()).toEqual(false);
        });
    });

    describe("Add new element", () => {
        test("Added element should be found in the DOM", () => {
            diagram.add(TestElement, { cx: 20, cy: 20, r: 10 });
            root.render();
    
            const element = document.getElementById("test_element");
    
            expect(element).toBeTruthy();
        });
    
        test("Added element should have correct tagName and attributes", () => {
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
});