"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxs = exports.jsx = void 0;
const h_1 = __importDefault(require("virtual-dom/h"));
function _jsx(tagName, properties, ...children) {
    return (0, h_1.default)(tagName, properties, children);
}
exports.jsx = _jsx;
exports.jsxs = _jsx;
