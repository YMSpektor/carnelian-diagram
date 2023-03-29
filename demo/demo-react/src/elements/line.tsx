/** @jsxImportSource @carnelian/diagram */

export interface LineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    stroke?: string;
}

export function Line(props: LineProps) {
    return (
        <line {...props} />
    );
}