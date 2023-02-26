/** @jsxImportSource carnelian-diagram */

export interface LineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    stroke?: string;
}

export function Line(props: LineProps) {
    const { x1, y1, x2, y2, stroke } = props;
    return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} />
    );
}