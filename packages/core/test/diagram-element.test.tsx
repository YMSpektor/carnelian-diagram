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

    test("Unchanged element should not be rerendered", () => {
        let r1 = 0;
        const TestComponent = () => {
            r1++;
            return <></>;
        }

        diagram.add(TestComponent, {});
        root.render();

        expect(r1).toEqual(1);

        root.render();
        expect(r1).toEqual(1);
    });

    test("Only modified element should be rerendered", () => {
        let r1 = 0;
        let r2 = 0;

        const TestComponent1 = () => {
            r1++;
            return <></>;
        }

        const TestComponent2 = () => {
            r2++;
            return <></>;
        }

        const e1 = diagram.add(TestComponent1, {});
        diagram.add(TestComponent2, {});
        root.render();

        expect(r1).toEqual(1);
        expect(r2).toEqual(1);

        diagram.update(e1, {...e1.props});
        root.render();
        expect(r1).toEqual(2);
        expect(r2).toEqual(1);
    });

    test("Invalidating root should not rerender an element", () => {
        let r1 = 0;
        const TestComponent = () => {
            r1++;
            return <></>;
        }

        diagram.add(TestComponent, {});
        root.render();

        expect(r1).toEqual(1);

        diagram.invalidate();
        root.render();
        expect(r1).toEqual(1);
    });
});