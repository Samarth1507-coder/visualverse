import React, { useRef, useEffect, useState, useCallback } from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = ({ 
  width = 800, 
  height = 600, 
  initialColor = '#000000',
  initialBrushSize = 3,
  onSave,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [brushSize, setBrushSize] = useState(initialBrushSize);
  const [tool, setTool] = useState('pen'); // pen, eraser
  const [isMobile, setIsMobile] = useState(false);

  // Color palette options
  const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFD700'
  ];

  // Brush size options
  const brushSizes = [1, 2, 3, 5, 8, 12, 16, 20];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const setCanvasSize = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Responsive sizing
      const maxWidth = Math.min(containerWidth - 40, width);
      const maxHeight = Math.min(containerHeight - 200, height);
      
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      
      // Set CSS size for responsive display
      canvas.style.width = `${maxWidth}px`;
      canvas.style.height = `${maxHeight}px`;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Get 2D context
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Set initial canvas background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    return () => window.removeEventListener('resize', setCanvasSize);
  }, [width, height]);

  // Update context when color or brush size changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize, tool]);

  // Get mouse/touch position relative to canvas
  const getPosition = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((event) => {
    event.preventDefault();
    setIsDrawing(true);
    const position = getPosition(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(position.x, position.y);
  }, [getPosition]);

  // Draw
  const draw = useCallback((event) => {
    event.preventDefault();
    if (!isDrawing) return;
    
    const position = getPosition(event);
    contextRef.current.lineTo(position.x, position.y);
    contextRef.current.stroke();
  }, [isDrawing, getPosition]);

  // Stop drawing
  const stopDrawing = useCallback((event) => {
    event.preventDefault();
    setIsDrawing(false);
    contextRef.current.closePath();
  }, []);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    contextRef.current.fillStyle = '#FFFFFF';
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Save canvas as image
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `visualverse-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    // Call onSave callback if provided
    if (onSave) {
      onSave(canvas.toDataURL());
    }
  };

  // Undo functionality (simple implementation)
  const undo = () => {
    // This is a simplified undo - in a production app, you'd want to implement
    // a proper undo stack with canvas states
    console.log('Undo functionality - implement with canvas state management');
  };

  // Redo functionality
  const redo = () => {
    console.log('Redo functionality - implement with canvas state management');
  };

  return (
    <div className={`drawing-canvas-container ${className}`}>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left side - Drawing tools */}
          <div className="flex items-center gap-3">
            {/* Tool selection */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTool('pen')}
                className={`p-2 rounded-lg transition-colors ${
                  tool === 'pen' 
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Pen Tool"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15.232 5.232l-3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded-lg transition-colors ${
                  tool === 'eraser' 
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Eraser Tool"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                </svg>
              </button>
            </div>

            {/* Brush size */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Size:</label>
              <select
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {brushSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Center - Color palette */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Color:</label>
            <div className="flex gap-1">
              {colorPalette.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === colorOption 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  title={colorOption}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Custom Color"
            />
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Undo"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={redo}
              className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Redo"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H9a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h5.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              title="Clear Canvas"
            >
              Clear
            </button>
            <button
              onClick={saveCanvas}
              className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              title="Save Drawing"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded-lg shadow-lg bg-white cursor-crosshair"
            style={{
              touchAction: 'none', // Prevents default touch behaviors on mobile
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>

      {/* Mobile Instructions */}
      {isMobile && (
        <div className="bg-blue-50 border-t border-blue-200 p-3">
          <p className="text-sm text-blue-800 text-center">
            💡 Use your finger to draw on the canvas. Pinch to zoom if needed.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
