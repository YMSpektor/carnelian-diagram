import { create } from "virtual-dom";
import { DiagramDocument } from "carnelian";
import { h } from "carnelian/jsx-runtime";

function Aux(props: {children: JSX.Element}): JSX.Element {
    return props.children;
}

function Hello(name: string) {
    const result = (
        <Aux>
            <line x1="0" y1="0" x2="100" y2="0" />
            <text x="0" y="0">{name}</text>
        </Aux>
    );

    return result;
}

const svg = create(h("svg", {xmlns: "http://www.w3.org/2000/svg"}, []));
const doc = new DiagramDocument();
doc.add(Hello, "World");
doc.add(Hello, "Second");
const tree = doc.render(svg);

console.log(tree.toString());