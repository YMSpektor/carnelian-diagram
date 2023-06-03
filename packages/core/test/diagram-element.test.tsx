/** @jsxImportSource ../src */

import { Diagram, DiagramRootRenderer, DiagramDOM, DiagramRoot, DiagramElement } from "../src";

interface TestElementProps {
    cx: number;
    cy: number;
    r: number;
}

describe("Diagram element tests", () => {
    let diagram: Diagram;
    let root: DiagramRootRenderer;

    beforeEach(() => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.replaceChildren(svg);
        diagram = new Diagram();
        root = DiagramDOM.createRoot(diagram, svg, DiagramRoot);
    });

    test("onChange should update an element props", () => {
        const props = { cx: 20, cy: 20, r: 10 };
        let updateRadius: (radius: number) => void = () => {};
        const TestElement: DiagramElement<TestElementProps> = (props) => {
            updateRadius = (radius: number) => {
                props.onChange((props) => ({...props, r: radius}));
            };

            return (
                <circle id="test_element" cx={props.cx} cy={props.cy} r={props.r} />
            );
        }
        diagram.add(TestElement, props);
        root.render();

        const element = document.getElementById("test_element");

        expect(element?.getAttribute("r")).toEqual(props.r.toString());

        const newRadius = props.r + 10;
        updateRadius(newRadius);
        root.render();
        expect(element?.getAttribute("r")).toEqual(newRadius.toString());
    });
});