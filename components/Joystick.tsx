'use client'
import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function Joystick() {
  const squareSize = 120;
  const smallCircleSize = 72;
  const maxDistance = (squareSize - smallCircleSize) / 2;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-maxDistance, maxDistance], ["-10deg", "10deg"]);
  const rotateY = useTransform(x, [-maxDistance, maxDistance], ["10deg", "-10deg"]);

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.div 
      className="fixed right-6 bottom-6 flex items-center justify-center"
      style={{ perspective: 500 }}
    >
      <motion.div
        className="bg-zinc-300 border-4 rounded-full overflow-hidden shadow-2xl flex items-center justify-center relative"
        style={{ 
          rotateX, 
          rotateY, 
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
          dragElastic={0.2}
          dragMomentum={false}
          style={{ 
            x: springX, 
            y: springY,
            width: smallCircleSize,
            height: smallCircleSize
          }}
          onDragEnd={() => {
            x.set(0);
            y.set(0);
          }}
        />
      </motion.div>
    </motion.div>
  );
}