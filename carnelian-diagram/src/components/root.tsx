/** @jsxImportSource .. */

import { DiagramComponent, DiagramRoot, DiagramRootProps, RenderContext, RenderContextType } from "..";

export interface RootProps {
    renderContext: RenderContextType;
    diagramRoot: DiagramRoot<DiagramRootProps>;
    diagramRootProps: DiagramRootProps;
}

export const Root: DiagramComponent<RootProps> = function(props) {
    this.context = RenderContext;
    this.contextValue = RenderContext.renderContext = props.renderContext;
    const DiagramRoot = props.diagramRoot;
    
    return (
        <DiagramRoot {...props.diagramRootProps}/>
    )
}