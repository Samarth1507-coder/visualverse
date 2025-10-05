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
  const [tool, setTool] = useState('pen'); // pen or eraser
  const [isMobile, setIsMobile] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFD700'
  ];
  const brushSizes = [1, 2, 3, 5, 8, 12, 16, 20];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasSize = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const maxWidth = Math.min(containerWidth - 40, width);
      const maxHeight = Math.min(containerHeight - 200, height);

      canvas.width = maxWidth;
      canvas.height = maxHeight;
      canvas.style.width = `${maxWidth}px`;
      canvas.style.height = `${maxHeight}px`;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Initial white background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    return () => window.removeEventListener('resize', setCanvasSize);
  }, [width, height]);

  // Update context when color, brush size, or tool changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize, tool]);

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

  const startDrawing = useCallback((event) => {
    event.preventDefault();
    setIsDrawing(true);
    const position = getPosition(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(position.x, position.y);
  }, [getPosition]);

  const draw = useCallback((event) => {
    event.preventDefault();
    if (!isDrawing) return;

    const position = getPosition(event);
    contextRef.current.lineTo(position.x, position.y);
    contextRef.current.stroke();
  }, [isDrawing, getPosition]);

  const stopDrawing = useCallback((event) => {
    event.preventDefault();
    if (!isDrawing) return;

    setIsDrawing(false);
    contextRef.current.closePath();

    // Save state for Undo
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    setHistoryStack(prev => [...prev, imageData]);
    setRedoStack([]);
  }, [isDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    contextRef.current.fillStyle = '#FFFFFF';
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);

    // Save cleared state
    const imageData = canvas.toDataURL();
    setHistoryStack(prev => [...prev, imageData]);
    setRedoStack([]);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    if (onSave) onSave(dataURL);

    const link = document.createElement('a');
    link.download = `visualverse-drawing-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const undo = () => {
    if (historyStack.length === 0) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;

    setHistoryStack(prev => {
      const newHistory = [...prev];
      const lastState = newHistory.pop();
      if (lastState) {
        setRedoStack(redoPrev => [...redoPrev, canvas.toDataURL()]);
        const img = new Image();
        img.src = lastState;
        img.onload = () => context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      return newHistory;
    });
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;

    setRedoStack(prev => {
      const newRedo = [...prev];
      const lastRedo = newRedo.pop();
      if (lastRedo) {
        setHistoryStack(prevHistory => [...prevHistory, canvas.toDataURL()]);
        const img = new Image();
        img.src = lastRedo;
        img.onload = () => context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      return newRedo;
    });
  };

  return (
    <div className={`drawing-canvas-container ${className}`}>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Tools */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors ${
                tool === 'pen' 
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Pen Tool"
            >
              ✏️
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
              🩹
            </button>

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

          {/* Color */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Color:</label>
            <div className="flex gap-1">
              {colorPalette.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === c ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
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

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={undo} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">↩️ Undo</button>
            <button onClick={redo} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">↪️ Redo</button>
            <button onClick={clearCanvas} className="px-3 py-2 text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100">Clear</button>
            <button onClick={saveCanvas} className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Save</button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded-lg shadow-lg bg-white cursor-crosshair"
            style={{ touchAction: 'none', maxWidth: '100%', maxHeight: '100%' }}
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
