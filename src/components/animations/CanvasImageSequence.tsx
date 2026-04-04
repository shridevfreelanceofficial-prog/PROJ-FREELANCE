'use client';

import { useMotionValueEvent, MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CanvasImageSequenceProps {
  progress: MotionValue<number>;
  frameCount: number;
  onBgColorExtracted?: (colorHex: string) => void;
}

export default function CanvasImageSequence({ progress, frameCount, onBgColorExtracted }: CanvasImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Preload images
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Format index as 3 digits: 001, 002, etc.
      const frameIndex = i.toString().padStart(3, '0');
      img.src = `/bulb-animation/ezgif-frame-${frameIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        // Extract exact edge pixel color from the first frame to seamlessly match the page wrapper
        if (i === 1 && onBgColorExtracted) {
            const tempCanvas = document.createElement('canvas');
            const tCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            if (tCtx) {
              tCtx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
              const p = tCtx.getImageData(0, 0, 1, 1).data;
              onBgColorExtracted(`rgb(${p[0]}, ${p[1]}, ${p[2]})`);
            }
        }

        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };

      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      imagesRef.current = [];
    };
  }, [frameCount]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && loaded) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // High DPI canvas setup
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Normalize coordinate system to use css pixels
        ctx.scale(dpr, dpr);

        const currentValue = progress.get();
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(currentValue * frameCount)
        );
        drawFrame(frameIndex);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded, frameCount, progress]);

  const drawFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];

    // Responsive drawing logic (maintain aspect ratio / cover)
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(rect.width / img.width, rect.height / img.height);
    const renderWidth = img.width * ratio;
    const renderHeight = img.height * ratio;
    const offsetX = (rect.width - renderWidth) / 2;
    const offsetY = (rect.height - renderHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear physical pixels
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight); // draw with css pixels
  };

  useMotionValueEvent(progress, 'change', (latest) => {
    if (!loaded) return;
    // Map progress (0 to 1) to frame index (0 to frameCount - 1)
    let frameIndex = Math.floor(latest * frameCount);
    if (frameIndex >= frameCount) frameIndex = frameCount - 1;
    if (frameIndex < 0) frameIndex = 0;

    drawFrame(frameIndex);
  });

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[#F4FFFA]">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ touchAction: 'none' }}
      />
      
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F4FFFA] z-10 text-[#00C896] text-sm tracking-widest uppercase font-medium">
          Loading Experience...
        </div>
      )}
    </div>
  );
}
