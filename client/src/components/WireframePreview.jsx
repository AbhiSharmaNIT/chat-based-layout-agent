function WireframePreview({ layoutJson }) {
  if (!layoutJson || !layoutJson.rootNodes || !layoutJson.nodes) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 mt-6">
        <h2 className="text-xl font-bold mb-4">Wireframe Preview</h2>
        <p className="text-red-500">Layout JSON not found.</p>
      </div>
    );
  }

  const artboardId = layoutJson.rootNodes[0];
  const artboard = layoutJson.nodes[artboardId];

  if (!artboard) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 mt-6">
        <h2 className="text-xl font-bold mb-4">Wireframe Preview</h2>
        <p className="text-red-500">Artboard not found in JSON.</p>
      </div>
    );
  }

  const previewWidth = 380;
  const scale = previewWidth / artboard.width;
  const previewHeight = artboard.height * scale;

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Wireframe Preview</h2>

      <div className="flex justify-center">
        <div
          className="relative overflow-hidden border border-gray-400 bg-gray-100"
          style={{
            width: previewWidth,
            height: previewHeight,
          }}
        >
          {artboard.children?.map((id) => {
            const node = layoutJson.nodes[id];

            if (!node) return null;

            const commonStyle = {
              position: "absolute",
              left: node.x * scale,
              top: node.y * scale,
              width: node.width * scale,
              height: node.height * scale,
            };

            if (node.type === "image") {
              return (
                <img
                  key={id}
                  src={node.data?.sourceUrl}
                  alt={node.name}
                  title={node.name}
                  style={{
                    ...commonStyle,
                    objectFit: node.data?.fit || "cover",
                  }}
                />
              );
            }

            if (node.type === "text") {
              return (
                <div
                  key={id}
                  style={{
                    ...commonStyle,
                    color: node.style?.visual?.color?.value || "#000",
                    fontSize: Math.max(
                      8,
                      (node.style?.visual?.fontSize || 16) * scale
                    ),
                    fontWeight: node.style?.visual?.fontWeight || 400,
                    fontStyle: node.style?.visual?.fontStyle || "normal",
                    fontFamily: node.style?.visual?.fontFamily || "Arial",
                    lineHeight: 1.1,
                    whiteSpace: "pre-line",
                    overflow: "hidden",
                    border: "1px solid rgba(59,130,246,0.6)",
                  }}
                >
                  {node.data?.content}
                </div>
              );
            }

            if (node.type === "shape") {
              return (
                <div
                  key={id}
                  style={{
                    ...commonStyle,
                    background:
                      node.style?.visual?.fill?.value || "transparent",
                    border: `${node.style?.visual?.strokeWidth || 1}px solid ${
                      node.style?.visual?.stroke?.value || "#000"
                    }`,
                    borderRadius:
                      node.data?.shapeType === "circle" ? "50%" : "0",
                  }}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default WireframePreview;