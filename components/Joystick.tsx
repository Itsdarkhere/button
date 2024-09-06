'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Joystick() {
  const squareSize = 120;
  const smallCircleSize = 72;
  const maxDistance = (squareSize - smallCircleSize) / 2;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: Math.max(Math.min(info.point.x, maxDistance), -maxDistance),
      y: Math.max(Math.min(info.point.y, maxDistance), -maxDistance),
    });
  };

  return (
    <div className="fixed right-6 bottom-6 flex items-center justify-center">
      <div
        className="bg-zinc-300 border-4 rounded-full overflow-hidden shadow-2xl flex items-center justify-center relative"
        style={{ 
          width: squareSize, 
          height: squareSize,
        }}
      >
        {/* 6 sections */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 pointer-events-none">
          <div className="border border-zinc-200 border-t-0"></div>
          <div className="border border-zinc-200 border-t-0"></div>
          <div className="border border-zinc-200 border-l-0"></div>
          <div className="border border-zinc-200 border-r-0"></div>
          <div className="border border-zinc-200 border-b-0"></div>
          <div className="border border-zinc-200 border-b-0"></div>
        </div>
        
        <motion.div
          className="w-20 h-20 rounded-full shadow-xl bg-zinc-200 cursor-grab active:cursor-grabbing z-10"
          drag
          dragConstraints={{
            top: -maxDistance,
            left: -maxDistance,
            right: maxDistance,
            bottom: maxDistance,
          }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          style={{ 
            width: smallCircleSize,
            height: smallCircleSize,
            x: position.x,
            y: position.y,
          }}
          onDragEnd={() => setPosition({ x: 0, y: 0 })}
        />
      </div>
    </div>
  );
}