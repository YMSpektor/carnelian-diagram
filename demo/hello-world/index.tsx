import { create, h } from "virtual-dom";
import { Diagram, DiagramDOM, DiagramRoot, useState } from "@carnelian/diagram";

function Test() {
    return <div className="test">Test</div>
}

function Hello(props: {name: string}) {
    const [state, setState] = useState("Hello");
    if (state === "Hello") {
        setState('Updated');
    }
    console.log(state);

    return (
        <>
            <text>{state} {props.name}</text>
            <Test />
        </>
    )
}

const svg = create(h("svg", {xmlns: "http://www.w3.org/2000/svg"}, [])) as SVGSVGElement;
const diagram = new Diagram();
diagram.add(Hello, {name: "World"});

const root = DiagramDOM.createRoot(diagram, svg, DiagramRoot);
root.attach();

setTimeout(() => console.log(svg.toString()), 10);