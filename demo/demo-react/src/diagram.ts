import { Diagram } from "@carnelian/diagram";
import { InteractionController, isGridSnappingService, isPaperService } from "@carnelian/interaction";
import { DiagramPaletteElement } from "./components/DiagramPalette";
import {
    InteractiveRect as Rect, 
    InteractiveEllipse as Ellipse, 
    InteractiveDiamond as Diamond,
    InteractiveRoundedRect as RoundedRect,
    InteractiveParallelogram as Parallelogram,
    InteractiveTrapezoid as Trapezoid,
    InteractiveHexagon as Hexagon,
    InteractiveSquare as Square,
    InteractiveCircle as Circle,
    InteractiveDonut as Donut,
    InteractiveCross as Cross,
    InteractivePie as Pie
} from "@carnelian/shapes/basic";
import {
    InteractivePacman as Pacman
} from "./examples"

export const controller = new InteractionController((services) => {
    const paperService = services.find(isPaperService);
    if (paperService) {
        paperService.paper = {
            x: 0,
            y: 0,
            width: 2100,
            height: 2970,
            majorGridSize: 200,
            minorGridSize: 50
        };
    }
    const gridSnappingService = services.find(isGridSnappingService);
    if (gridSnappingService) {
        gridSnappingService.snapGridSize = 50;
        gridSnappingService.snapAngle = 5;
    }
});
export const diagram = new Diagram();

export const palette: DiagramPaletteElement<any>[] = [];

function addToPalette<T extends object>(element: DiagramPaletteElement<T>) {
    palette.push(element);
}

addToPalette({
    category: "basic",
    elementType: Rect,
    elementProps: {x: 20, y: 20, width: 300, height: 200},
    viewBox: "0 0 340 240",
    title: "Rectangle",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: RoundedRect,
    elementProps: {x: 20, y: 20, width: 300, height: 200, radius: "50%"},
    viewBox: "0 0 340 240",
    title: "Rounded Rectangle",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Ellipse,
    elementProps: {x: 20, y: 20, width: 300, height: 200},
    viewBox: "0 0 340 240",
    title: "Ellipse",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Parallelogram,
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "20%"},
    viewBox: "0 0 340 240",
    title: "Parallelogram",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Trapezoid,
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "20%"},
    viewBox: "0 0 340 240",
    title: "Trapezoid",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Hexagon,
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "20%"},
    viewBox: "0 0 340 240",
    title: "Hexagon",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Diamond,
    elementProps: {x: 20, y: 20, width: 300, height: 300},
    viewBox: "0 0 340 340",
    title: "Diamond",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Square,
    elementProps: {x: 20, y: 20, size: 300},
    viewBox: "0 0 340 340",
    title: "Square",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.size / 2,
        y: point.y - props.size / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Circle,
    elementProps: {x: 160, y: 160, radius: 150},
    viewBox: "0 0 340 340",
    title: "Circle",
    factory: (point, props) => ({
        ...props,
        x: point.x,
        y: point.y
    }),
});

addToPalette({
    category: "basic",
    elementType: Donut,
    elementProps: {x: 160, y: 160, radius: 150, innerRadius: "60%"},
    viewBox: "0 0 340 340",
    title: "Donut",
    factory: (point, props) => ({
        ...props,
        x: point.x,
        y: point.y
    }),
});

addToPalette({
    category: "basic",
    elementType: Cross,
    elementProps: {x: 20, y: 20, width: 300, height: 300, offsetX: "25%", offsetY: "25%"},
    viewBox: "0 0 340 340",
    title: "Cross",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Pie,
    elementProps: {x: 160, y: 160, radius: 150, startAngle: 45, endAngle: -45},
    viewBox: "0 0 340 340",
    title: "Pie",
    factory: (point, props) => ({
        ...props,
        x: point.x,
        y: point.y
    }),
});

addToPalette({
    category: "examples",
    elementType: Pacman,
    elementProps: {x: 160, y: 160, radius: 150, mouthAngle: 90, eyeRadius: "25%"},
    viewBox: "0 0 340 340",
    title: "Pacman",
    factory: (point, props) => ({
        ...props,
        x: point.x,
        y: point.y
    }),
});

