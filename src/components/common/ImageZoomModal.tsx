"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ImageZoomModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomModal({ imageUrl, isOpen, onClose }: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const zoomIn = () => setScale(prev => Math.min(prev * 1.2, 5));
  const zoomOut = () => setScale(prev => Math.max(prev * 0.8, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button variant="secondary" size="sm" onClick={zoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={zoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={rotate}>
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={resetView}>
          Reset
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Scale indicator */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {Math.round(scale * 100)}%
      </div>

      {/* Image */}
      <div className="flex items-center justify-center w-full h-full overflow-hidden">
        <img
          src={imageUrl}
          alt="Zoomed document"
          className={`max-w-none transition-transform duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            maxHeight: '90vh',
            maxWidth: '90vw'
          }}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-sm">
        Scroll to zoom • Drag to pan • Click outside to close
      </div>
    </div>
  );
}