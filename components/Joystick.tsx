'use client'
import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function Joystick() {
  const bigCircleSize = 120;
  const smallCircleSize = 48;
  const maxDistance = (bigCircleSize - smallCircleSize) / 2;

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
        className="w-30 h-30 rounded-full bg-zinc-700 shadow-xl flex items-center justify-center"
        style={{ rotateX, rotateY, width: bigCircleSize, height: bigCircleSize }}
      >
        <motion.div
          className="w-12 h-12 rounded-full bg-zinc-400 shadow-md cursor-grab active:cursor-grabbing"
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