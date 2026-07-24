import React, { useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

interface PinchZoomViewerProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  maxScale?: number;
  minScale?: number;
  doubleTapScale?: number;
}

export function PinchZoomViewer({
  src,
  alt,
  className = '',
  imgClassName = 'object-contain',
  onClick,
  maxScale = 3.5,
  minScale = 0.8,
  doubleTapScale = 2.5,
}: PinchZoomViewerProps) {
  const domTarget = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const [{ scale, x, y }, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    config: { tension: 280, friction: 26 },
  }));

  useGesture(
    {
      onPinch: ({ offset: [s], memo }) => {
        const clampedScale = Math.min(maxScale, Math.max(minScale, s));
        api.start({ scale: clampedScale });
        return memo;
      },
      onDrag: ({ offset: [dx, dy], pinching, cancel }) => {
        if (pinching) return cancel();
        // Only allow pan when zoomed in
        if (scale.get() > 1.05) {
          api.start({ x: dx, y: dy });
        } else {
          api.start({ x: 0, y: 0 });
        }
      },
    },
    {
      target: domTarget,
      eventOptions: { passive: false },
      pinch: {
        scaleBounds: { min: minScale, max: maxScale },
        from: () => [scale.get(), 0],
      },
      drag: {
        from: () => [x.get(), y.get()],
      },
    }
  );

  // Prevent default touch moves to avoid unwanted page scrolling during pinch gesture
  useEffect(() => {
    const handler = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const node = domTarget.current;
    if (node) {
      node.addEventListener('touchmove', handler, { passive: false });
    }
    return () => {
      if (node) {
        node.removeEventListener('touchmove', handler);
      }
    };
  }, []);

  const handleContainerClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap / double click
      const currentScale = scale.get();
      if (currentScale > 1.2) {
        api.start({ scale: 1, x: 0, y: 0 });
      } else {
        api.start({ scale: doubleTapScale, x: 0, y: 0 });
      }
    } else {
      if (onClick) {
        onClick();
      }
    }
    lastTapRef.current = now;
  };

  return (
    <div
      ref={domTarget}
      className={`touch-none select-none overflow-hidden relative cursor-grab active:cursor-grabbing ${className}`}
      onClick={handleContainerClick}
    >
      <animated.img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        style={{
          scale,
          x,
          y,
        }}
        className={`w-full h-full ${imgClassName}`}
      />
    </div>
  );
}

export default PinchZoomViewer;
