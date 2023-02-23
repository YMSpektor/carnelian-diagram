"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagramDocument = void 0;
const virtual_dom_1 = require("virtual-dom");
const h_1 = __importDefault(require("virtual-dom/h"));
class DiagramDocument {
    constructor() {
        this.elements = [];
        this.lastTree = (0, h_1.default)("", []);
    }
    add(type, props) {
        const element = {
            type,
            props
        };
        this.elements.push(element);
        return element;
    }
    render(rootNode) {
        const nodes = this.elements.map(element => element.type(element.props));
        const tree = (0, h_1.default)("", nodes);
        const lastTree = this.lastTree;
        const patches = (0, virtual_dom_1.diff)(lastTree, tree);
        this.lastTree = tree;
        return (0, virtual_dom_1.patch)(rootNode, patches);
    }
}
exports.DiagramDocument = DiagramDocument;
