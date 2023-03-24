import { create, h } from "virtual-dom";
import { Diagram, useState } from "carnelian";
import { InteractiveDiagramRoot } from "carnelian/interactivity";

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
const doc = new Diagram(InteractiveDiagramRoot);
doc.add(Hello, {name: "World"});
doc.attach(svg);

setTimeout(() => console.log(svg.toString()), 10);