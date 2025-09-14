import CanvasDraw from "react-canvas-draw";
import "./Canvas.css";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../contexts/socketContext";

const COLORS = ["black", "red", "blue", "green", "orange", "purple"];

const Canvas = () => {
  const canvasRef = useRef<CanvasDraw>(null);
  const socket = useSocket();
  const [brushColor, setBrushColor] = useState("black");
  const [canDraw, setCanDraw] = useState(false);

  useEffect(() => {
    if (!canDraw) return;

    const interval = setInterval(() => {
      const data = canvasRef.current?.getSaveData();
      if (data) socket?.emit("drawing", data);
    }, 1000);

    return () => clearInterval(interval);
  }, [socket, canDraw]);

  useEffect(() => {
    if (!socket) return;

    const handleDrawing = (data: string) => {
      canvasRef.current?.loadSaveData(data, true);
    };

    const handleClear = () => {
      canvasRef.current?.clear();
    };

    const handleCharge = (id: string) => {
      setCanDraw(socket.id === id);
    };

    const handleWhoInCharge = (id: string) => {
      setCanDraw(socket.id === id);
    };

    socket.on("drawing", handleDrawing);
    socket.on("drawing:clear", handleClear);
    socket.on("drawing:charge", handleCharge);
    socket.on("drawing:whoInCharge", handleWhoInCharge);

    socket.emit("drawing:whoInCharge");

    return () => {
      socket.off("drawing", handleDrawing);
      socket.off("drawing:clear", handleClear);
      socket.off("drawing:charge", handleCharge);
      socket.off("drawing:whoInCharge", handleWhoInCharge);
    };
  }, [socket]);

  const clearCanvas = () => {
    if (!canDraw) return;
    canvasRef.current?.clear();
    socket?.emit("drawing:clear");
  };

  const takeCharge = () => {
    socket?.emit("drawing:charge", socket?.id);
  };

  return (
    <div className="canvas-container">
      <div className="color-picker">
        {COLORS.map((color) => (
          <button
            key={color}
            style={{
              background: color,
              color: color === "black" ? "white" : "black",
              border: brushColor === color ? "2px solid #333" : "1px solid #ccc",
            }}
            onClick={() => setBrushColor(color)}
            disabled={!canDraw}
          >
            {color}
          </button>
        ))}
      </div>

      <CanvasDraw
        ref={canvasRef}
        brushColor={brushColor}
        brushRadius={2}
        disabled={!canDraw}
      />

      <div className="controls">
        <button onClick={clearCanvas} disabled={!canDraw}>
          Clear Canvas
        </button>
        <button onClick={takeCharge} disabled={canDraw}>
          Take Charge
        </button>
      </div>

      <p className="status">
        {canDraw ? "🖌 You are drawing!" : "Click 'Take Charge' to draw."}
      </p>
    </div>
  );
};

export default Canvas;