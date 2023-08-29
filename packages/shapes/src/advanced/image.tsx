/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect } from "../hocs";

export interface ImageProps extends RectBaseProps {
    href: string;
    preserveAspectRatio?: string;
    crossorigin?: string;
    decoding?: "sync" | "async" | "auto";
}

export const Image: DiagramElement<ImageProps> = function(props) {
    const { onChange, href, ...rest } = props;
    const imgProps = {
        ...rest,
        "xlink:href": href
    };

    return (
        <image {...imgProps} />
    );
}

export const InteractiveImage = withInteractiveRotatableRect(Image);