import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pencil, Trash2, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface WhiteboardProps {
  className?: string;
}

export default function Whiteboard({ className }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // Save content
      const tempImage = canvas.toDataURL();
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Restore content
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = tempImage;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'whiteboard-notes.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}>
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scratchpad & Visualizer</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTool('pencil')}
            className={cn("p-2 rounded-md border border-slate-200 transition-all hover:bg-slate-50 shadow-sm", tool === 'pencil' && "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700")}
          >
            <Pencil size={14} />
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={cn("p-2 rounded-md border border-slate-200 transition-all hover:bg-slate-50 shadow-sm", tool === 'eraser' && "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700")}
          >
            <Eraser size={14} />
          </button>
          <div className="w-[1px] h-6 bg-slate-200 mx-1" />
          <button 
            onClick={clearCanvas}
            className="p-2 rounded-md border border-slate-200 transition-all hover:bg-red-50 hover:text-red-600 shadow-sm"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={download}
            className="p-2 rounded-md border border-slate-200 transition-all hover:bg-slate-50 shadow-sm"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-slate-50 cursor-crosshair">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="absolute inset-0"
        />
      </div>

      <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex gap-2">
          {['#000000', '#4f46e5', '#dc2626', '#16a34a'].map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('pencil'); }}
              className={cn(
                "w-5 h-5 rounded-full border border-slate-200 transition-transform hover:scale-110",
                color === c && tool === 'pencil' && "ring-2 ring-indigo-500 ring-offset-2"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={brushSize} 
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-20 accent-indigo-600"
        />
      </div>
    </div>
  );
}
