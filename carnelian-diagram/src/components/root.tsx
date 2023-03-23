/** @jsxImportSource .. */

import { DiagramComponent, DiagramRoot, DiagramRootProps, RenderContext, RenderContextType } from "..";

export interface RootProps {
    renderContext: RenderContextType;
    diagramRoot: DiagramRoot<DiagramRootProps>;
    diagramRootProps: DiagramRootProps;
}

export const Root: DiagramComponent<RootProps> = function(props) {
    RenderContext.provide(this, props.renderContext);
    const DiagramRoot = props.diagramRoot;
    
    return (
        <DiagramRoot {...props.diagramRootProps}/>
    )
}