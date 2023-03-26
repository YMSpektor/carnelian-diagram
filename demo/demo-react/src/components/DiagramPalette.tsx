/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { Box } from "@mui/material";
import { DiagramElement } from "carnelian-diagram";
import DiagramElementThumbnail from "./DiagramElementThumbnail";
import Typography from "@mui/material/Typography";

export interface DiagramPaletteElement<T extends object> {
    elementType: DiagramElement<T>;
    elementProps: T;
    viewBox: string;
    title: string;
}

interface DiagramPaletteProps {
    thumbWidth: number;
    thumbHeight: number;
    elements: DiagramPaletteElement<any>[];
}

function DiagramPalette(props: DiagramPaletteProps & HTMLAttributes<HTMLDivElement>) {
    const {thumbWidth, thumbHeight, elements, ...divProps} = props;

    return (
        <Box
            sx={{
                bgcolor: (theme) => theme.palette.primary.light
            }}
            css={{display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 8, padding: 8, overflowY: "auto"}} 
            {...divProps}
        >
            {props.elements.map((element, i) => (
                <Box 
                    key={i} 
                    css={{position: "relative", width: thumbWidth, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "center"}} 
                >
                    <Box>
                        <DiagramElementThumbnail
                            width={thumbWidth} height={thumbHeight}
                            {...element}
                        />
                     </Box>
                     <Typography variant="caption">
                        {element.title}
                    </Typography>
                    <Box draggable={true} css={{position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0}}/>
                </Box>
            ))}
        </Box>
    )
}

export default DiagramPalette;