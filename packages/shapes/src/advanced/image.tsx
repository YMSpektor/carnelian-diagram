/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { ImageBaseProps } from "..";
import { withInteractiveRotatableRect } from "../hocs";

export interface ImageProps extends ImageBaseProps {}

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