import {
    InteractiveRectWithText as Rect, 
    InteractiveEllipseWithText as Ellipse, 
    InteractiveDiamondWithText as Diamond,
    InteractiveRoundedRectWithText as RoundedRect,
    InteractiveParallelogramWithText as Parallelogram,
    InteractiveTrapezoidWithText as Trapezoid,
    InteractivePentagonWithText as Pentagon,
    InteractiveHexagonWithText as Hexagon,
    InteractiveOctagonWithText as Octagon,
    InteractiveSquareWithText as Square,
    InteractiveCircleWithText as Circle,
    InteractiveDonutWithText as Donut,
    InteractiveCrossWithText as Cross,
    InteractivePie as Pie,
    InteractiveStar4WithText as Star4,
    InteractiveStarWithText as Star
} from "@carnelian-diagram/shapes/basic";
import {
    InteractiveBlockWithText as Block,
    InteractiveNoteWithText as Note,
    InteractiveCalloutWithText as Callout,
    InteractiveStepWithText as Step,
    InteractiveCloudWithText as Cloud,
    InteractiveArrow as Arrow,
    InteractiveDoubleArrow as DoubleArrow,
    InteractiveCubeWithText as Cube,
    InteractiveCylinderWithText as Cylinder,
    InteractiveImage as Image
} from "@carnelian-diagram/shapes/advanced";
import {
    InteractivePacman as Pacman
} from "../examples"
import { TextStyle } from "@carnelian-diagram/shapes";
import { DiagramElement } from "@carnelian-diagram/core";
import { ElementFactory } from "../context/DragDropContext";

export interface DiagramPaletteElement<T extends object> {
    category: string;
    elementType: DiagramElement<T>;
    elementProps: T;
    viewBox: string;
    title: string;
    factory: ElementFactory<T>;
}

export const palette: DiagramPaletteElement<any>[] = [];

function addToPalette<T extends object>(element: DiagramPaletteElement<T>) {
    palette.push(element);
}

export const defaultTextStyles: TextStyle = { fontSize: "50px" }

addToPalette({
    category: "basic",
    elementType: Rect,
    elementProps: {x: 20, y: 20, width: 300, height: 200, textStyle: defaultTextStyles},
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
    elementProps: {x: 20, y: 20, width: 300, height: 200, radius: "50%", textStyle: defaultTextStyles},
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
    elementProps: {x: 20, y: 20, width: 300, height: 200, textStyle: defaultTextStyles},
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
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "20%", textStyle: defaultTextStyles},
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
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "20%", textStyle: defaultTextStyles},
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
    elementType: Pentagon,
    elementProps: {x: 20, y: 20, width: 300, height: 300, textStyle: defaultTextStyles},
    viewBox: "0 0 340 340",
    title: "Pentagon",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Hexagon,
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "20%", textStyle: defaultTextStyles},
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
    elementType: Octagon,
    elementProps: {x: 20, y: 20, width: 300, height: 300, offset: "25%", textStyle: defaultTextStyles},
    viewBox: "0 0 340 340",
    title: "Octagon",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Diamond,
    elementProps: {x: 20, y: 20, width: 300, height: 300, textStyle: defaultTextStyles},
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
    elementProps: {x: 20, y: 20, size: 300, textStyle: defaultTextStyles},
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
    elementProps: {x: 160, y: 160, radius: 150, textStyle: defaultTextStyles},
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
    elementProps: {x: 160, y: 160, radius: 150, innerRadius: "60%", textStyle: defaultTextStyles},
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
    elementProps: {x: 20, y: 20, width: 300, height: 300, offsetX: "25%", offsetY: "25%", textStyle: defaultTextStyles},
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
    category: "basic",
    elementType: Star4,
    elementProps: {x: 20, y: 20, width: 300, height: 300, offsetX: "25%", offsetY: "25%", textStyle: defaultTextStyles},
    viewBox: "0 0 340 340",
    title: "4 Point Star",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "basic",
    elementType: Star,
    elementProps: {x: 20, y: 20, width: 300, height: 300, textStyle: defaultTextStyles},
    viewBox: "0 0 340 340",
    title: "Star",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Block,
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "10%", textStyle: defaultTextStyles},
    viewBox: "0 0 340 240",
    title: "Block",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Note,
    elementProps: {x: 20, y: 20, width: 200, height: 300, offset: "20%", textStyle: defaultTextStyles},
    viewBox: "0 0 240 340",
    title: "Note",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Callout,
    elementProps: {x: 20, y: 20, width: 300, height: 200, tailOffset: "20%", tailWidth: "15%", tailPointerPositionX: "10%", tailPointerPositionY: 50, textStyle: defaultTextStyles},
    viewBox: "0 0 340 280",
    title: "Callout",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Step,
    elementProps: {x: 20, y: 20, width: 300, height: 200, offset: "20%", textStyle: defaultTextStyles},
    viewBox: "0 0 340 240",
    title: "Step",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Cloud,
    elementProps: {x: 20, y: 20, width: 300, height: 200, textStyle: defaultTextStyles},
    viewBox: "0 0 340 240",
    title: "Cloud",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Arrow,
    elementProps: {x: 20, y: 20, width: 300, height: 200, arrowWidth: "50%", arrowHeight: "50%"},
    viewBox: "0 0 340 240",
    title: "Arrow",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: DoubleArrow,
    elementProps: {x: 20, y: 20, width: 300, height: 200, arrowWidth: "25%", arrowHeight: "50%"},
    viewBox: "0 0 340 240",
    title: "Double Arrow",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Cube,
    elementProps: {x: 20, y: 20, width: 300, height: 300, offsetX: "20%", offsetY: "20%", textStyle: defaultTextStyles},
    viewBox: "0 0 340 340",
    title: "Cube",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Cylinder,
    elementProps: {x: 20, y: 20, width: 200, height: 300, ry: "20%", textStyle: defaultTextStyles},
    viewBox: "0 0 240 340",
    title: "Cylinder",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "advanced",
    elementType: Image,
    elementProps: {x: 20, y: 20, width: 300, height: 300, href: "image_thumb.png"},
    viewBox: "0 0 340 340",
    title: "Image",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    category: "examples",
    elementType: Pacman,
    elementProps: {x: 160, y: 160, radius: 150, mouthAngle: 90, eyeRadius: "15%"},
    viewBox: "0 0 340 340",
    title: "Pacman",
    factory: (point, props) => ({
        ...props,
        x: point.x,
        y: point.y
    }),
});