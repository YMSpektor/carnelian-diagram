import "geometry-polyfill";

global.PointerEvent = global.MouseEvent as any;

global.Element.prototype.setPointerCapture = () => {};
global.Element.prototype.releasePointerCapture = () => {};