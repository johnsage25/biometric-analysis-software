import React, { useEffect, useRef } from 'react'


type Props = {}

function PdfViewerComponent({ }: Props) {
    const viewer = useRef(null);

    return (
        <div className="MyComponent">
            <div className="webviewer h-screen" ref={viewer}></div>
        </div>
    );
}

export default PdfViewerComponent