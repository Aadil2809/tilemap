import React, { useRef, useEffect, useState } from 'react';

const TileMap = () => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1); // Zoom level
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Drag offset
  const [isDragging, setIsDragging] = useState(false); // Drag state
  const dragStart = useRef({ x: 0, y: 0 }); // Initial drag position

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawGrid = () => {
      const tileSize = 50; // Base tile size
      const gridSize = 10; // 10x10 grid

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();
      ctx.translate(offset.x, offset.y); // Apply drag offset
      ctx.scale(zoom, zoom); // Apply zoom

      // Draw tiles
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          ctx.fillStyle = (row + col) % 2 === 0 ? '#ccc' : '#999'; // Alternate colors
          ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
          ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
      }

      ctx.restore();
    };

    drawGrid();
  }, [zoom, offset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAmount = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prevZoom) => Math.min(Math.max(prevZoom + scaleAmount, 0.5), 2)); // Limit zoom between 0.5x and 2x
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      style={{ border: '1px solid black', cursor: 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop dragging if the mouse leaves the canvas
      onWheel={handleWheel}
    />
  );
};

export default TileMap;
p