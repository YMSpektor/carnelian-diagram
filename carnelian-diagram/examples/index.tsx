import { create, h } from "virtual-dom";
import { Diagram, useState } from "carnelian";

function Test() {
    return <div className="test">Test</div>
}

function Hello(name: string) {
    const [state, setState] = useState("Hello");
    if (state === "Hello") {
        setState('Updated');
    }
    console.log(state);

    return (
        <>
            <text>{state} {name}</text>
            <Test />
        </>
    )
}

const svg = create(h("svg", {xmlns: "http://www.w3.org/2000/svg"}, [])) as SVGSVGElement;
const doc = new Diagram();
doc.add(Hello, "World");
doc.attach(svg);

setTimeout(() => console.log(svg.toString()), 10);