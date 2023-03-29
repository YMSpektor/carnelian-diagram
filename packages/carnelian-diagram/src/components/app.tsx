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
    
    return (
        <DiagramRoot {...props.diagramRootProps}/>
    )
}