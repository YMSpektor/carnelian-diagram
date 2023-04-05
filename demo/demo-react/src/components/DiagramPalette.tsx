/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useContext } from "react";
import { DiagramElement } from "@carnelian/diagram";
import DiagramElementIcon from "./DiagramElementIcon";
import Typography from "@mui/material/Typography";
import { DragDropContext, ElementFactory } from "../context/DragDropContext";

export interface DiagramPaletteElement<T extends object> {
    category: string;
    elementType: DiagramElement<T>;
    elementProps: T;
    viewBox: string;
    title: string;
    factory: ElementFactory<T>;
}

interface DiagramPaletteProps {
    iconWidth: number;
    iconHeight: number;
    palette: DiagramPaletteElement<any>[];
}

function DiagramPalette(props: DiagramPaletteProps & HTMLAttributes<HTMLDivElement>) {
    const {iconWidth, iconHeight, palette, ...divProps} = props;

    const dragDropContext = useContext(DragDropContext);

    function dragStartHandler<T extends object>(e: React.DragEvent, element: DiagramPaletteElement<T>) {
        // Set empty drag image
        var img = document.createElement("img");   
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        e.dataTransfer.setDragImage(img, 0, 0);

        dragDropContext.draggedElement = element;
    }

    function dragEndHandle(e: React.DragEvent) {
        dragDropContext.draggedElement = null;
    }

    return (
        <div
            css={{display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 8, padding: 8, overflowY: "auto"}} 
            {...divProps}
        >
            {palette.map((element, i) => (
                <div 
                    key={i} 
                    css={{width: iconWidth, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "center"}}
                    draggable={true}
                    onDragStart={e => dragStartHandler(e, element)}
                    onDragEnd={dragEndHandle}
                >
                    <div>
                        <DiagramElementIcon
                            width={iconWidth} height={iconHeight}
                            elementType={element.elementType}
                            elementProps={element.elementProps}
                            viewBox={element.viewBox}
                            strokeWidth={5}
                        />
                     </div>
                     <Typography variant="caption">
                        {element.title}
                    </Typography>
                </div>
            ))}
        </div>
    )
}

export default DiagramPalette;