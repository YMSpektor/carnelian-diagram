/** @jsxImportSource .. */

import { DiagramComponent, DiagramRootComponent, DiagramRootProps, RenderContext, RenderContextType } from "..";

export interface AppProps {
    renderContext: RenderContextType;
    diagramRoot: DiagramRootComponent;
    diagramRootProps: DiagramRootProps;
}

export const App: DiagramComponent<AppProps> = function(props) {
    RenderContext.provide(this, props.renderContext);
    const DiagramRoot = props.diagramRoot;

    const defaultStyles = [
        ".carnelian-diagram { stroke: black; fill: white }",
        ".carnelian-diagram text { stroke: none; fill: black; user-select: none }"
    ];
    
    return (
        <>
            <style>
                {defaultStyles.join("\n")}
            </style>
            <DiagramRoot {...props.diagramRootProps}/>
        </>
    )
}