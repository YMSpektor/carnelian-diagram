import React, { useLayoutEffect, useRef } from 'react';
import doc from "./diagram-document";

function App() {
  const svg = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    svg.current && doc.render(svg.current);
  }, []);

  return (
    <svg ref={svg} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" />
  );
}

export default App;
