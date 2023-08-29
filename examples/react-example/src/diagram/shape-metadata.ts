import { DiagramElement } from "@carnelian-diagram/core";
import {
    InteractiveLine as Line,
    InteractivePolyline as Polyline,
    InteractivePolygon as Polygon,
    InteractiveMultilineText as Text,
    InteractivePie as Pie
} from "@carnelian-diagram/shapes/basic";
import {
    InteractiveArrow as Arrow,
    InteractiveDoubleArrow as DoubleArrow,
    InteractiveImage as Image
} from "@carnelian-diagram/shapes/advanced";
import {
    InteractivePacman as Pacman
} from "../examples"

export interface ShapeMetadata {
    hasFill?: boolean;
    hasStroke?: boolean;
    hasText?: boolean;
    hasLineCaps?: boolean;
}

const shapeMetadataRegistry = new Map<DiagramElement<any>, ShapeMetadata>();

function addShapeMetadata(type: DiagramElement<any>, metadata: ShapeMetadata) {
    shapeMetadataRegistry.set(type, metadata);
}

export function getShapeMetadata(type: DiagramElement<any>): ShapeMetadata {
    const metadata = shapeMetadataRegistry.get(type);
    return {
        hasFill: metadata?.hasFill !== undefined ? metadata.hasFill : true,
        hasStroke: metadata?.hasStroke !== undefined ? metadata.hasStroke : true,
        hasText: metadata?.hasText !== undefined ? metadata.hasText : true,
        hasLineCaps: metadata?.hasLineCaps
    }
}

const LINE_FIGURE_METADATA: ShapeMetadata = {
    hasFill: false,
    hasStroke: true,
    hasText: false,
    hasLineCaps: true
};

const CLOSED_FIGURE_NO_TEXT_METADATA: ShapeMetadata = {
    hasFill: true,
    hasStroke: true,
    hasText: false,
    hasLineCaps: false
};

const TEXT_FIGURE_METADATA: ShapeMetadata = {
    hasFill: false,
    hasStroke: false,
    hasText: true,
    hasLineCaps: false
};

const IMAGE_FIGURE_METADATA: ShapeMetadata = {
    hasFill: false,
    hasStroke: false,
    hasText: false,
    hasLineCaps: false
};

addShapeMetadata(Line, LINE_FIGURE_METADATA);
addShapeMetadata(Polyline, LINE_FIGURE_METADATA);

addShapeMetadata(Pie, CLOSED_FIGURE_NO_TEXT_METADATA);
addShapeMetadata(Polygon, CLOSED_FIGURE_NO_TEXT_METADATA);
addShapeMetadata(Arrow, CLOSED_FIGURE_NO_TEXT_METADATA);
addShapeMetadata(DoubleArrow, CLOSED_FIGURE_NO_TEXT_METADATA);
addShapeMetadata(Pacman, CLOSED_FIGURE_NO_TEXT_METADATA);

addShapeMetadata(Text, TEXT_FIGURE_METADATA);

addShapeMetadata(Image, IMAGE_FIGURE_METADATA);