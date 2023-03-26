import { HTMLAttributes } from "react";

interface DiagramPaletteProps {

}

function DiagramPalette(props: DiagramPaletteProps & HTMLAttributes<HTMLDivElement>) {
    const {...divProps} = props;

    return (
        <div {...divProps}>

        </div>
    )
}

export default DiagramPalette;