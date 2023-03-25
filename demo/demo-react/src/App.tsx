import React from 'react';
import DiagramViewer from './components/DiagramViewer';
import doc from "./diagram-document";

function App() {
    return (
        <DiagramViewer diagram={doc} diagramSize={{width: 800, height: 600}} />
    )
}

export default App;
