import { create } from "virtual-dom";
import h from "virtual-dom/h";
import { DiagramDocument } from "carnelian";

function Hello(name: string) {
    const result = (
        <div className="asd">
            Hello {name}
            <div> Hello Nested </div>
            <div> Hello Nested 2</div>
        </div>
    );

    return result;
}

const svg = create(h("svg", {xmlns: "http://www.w3.org/2000/svg"}, []));
const doc = new DiagramDocument();
doc.add(Hello, "World");
doc.add(Hello, "Second");
const tree = doc.render(svg);

console.log(tree.toString());