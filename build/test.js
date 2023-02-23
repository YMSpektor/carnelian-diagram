"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("carnelian/jsx-runtime");
const virtual_dom_1 = require("virtual-dom");
const h_1 = __importDefault(require("virtual-dom/h"));
const carnelian_1 = require("carnelian");
function Hello(name) {
    const result = ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "asd" }, { children: ["Hello ", name, (0, jsx_runtime_1.jsx)("div", { children: " Hello Nested " }), (0, jsx_runtime_1.jsx)("div", { children: " Hello Nested 2" })] })));
    return result;
}
const svg = (0, virtual_dom_1.create)((0, h_1.default)("svg", { xmlns: "http://www.w3.org/2000/svg" }, []));
const doc = new carnelian_1.DiagramDocument();
doc.add(Hello, "World");
doc.add(Hello, "Second");
const tree = doc.render(svg);
console.log(tree.toString());
