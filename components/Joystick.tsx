'use client'
import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PanInfo, motion } from 'framer-motion';

export default function Joystick() {
    const router = useRouter();
  const squareSize = 120;
  const smallCircleSize = 72;
  const maxDistance = (squareSize - smallCircleSize) / 2;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);
  const isDragging = useRef(false);

  const determineSection = useCallback((x: number, y: number) => {
    const invertedY = -y;
    const thirdDistance = maxDistance / 3;
    
    // Adjust x-axis sensitivity
    const xThreshold = maxDistance / 10; // 10% of max distance as threshold

    if (invertedY > thirdDistance) {
      return x < -xThreshold ? 1 : 2;
    } else if (invertedY < -thirdDistance) {
      return x < -xThreshold ? 5 : 6;
    } else {
      return x < -xThreshold ? 3 : 4;
    }
  }, [maxDistance]);

  const getSectionCenter = useCallback((section: number) => {
    const halfDistance = maxDistance / 2;
    switch (section) {
      case 1: return { x: -halfDistance * 1.5, y: -halfDistance * 2 };
      case 2: return { x: halfDistance * 1.5, y: -halfDistance * 2 };
      case 3: return { x: -halfDistance * 1.5, y: 0 };
      case 4: return { x: halfDistance * 1.5, y: 0 };
      case 5: return { x: -halfDistance * 1.5, y: halfDistance * 2 };
      case 6: return { x: halfDistance * 1.5, y: halfDistance * 2 };
      default: return { x: 0, y: 0 };
    }
  }, [maxDistance]);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleDrag = useCallback((event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
    const newPosition = {
      x: Math.max(Math.min(info.offset.x, maxDistance), -maxDistance),
      y: Math.max(Math.min(info.offset.y, maxDistance), -maxDistance),
    };
    setPosition(newPosition);
    setActiveSection(determineSection(newPosition.x, newPosition.y));
  }, [determineSection, maxDistance]);

  const handleDragEnd = useCallback(() => {
    console.log(`Released in Section ${activeSection}`);
    const sectionCenter = getSectionCenter(activeSection);
    setPosition(sectionCenter);
    isDragging.current = false;
    navigateTo(activeSection)
  }, [activeSection, getSectionCenter]);

  const sectionToLetterMap: { [key: number]: string } = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f'
  };

  const navigateTo = (activeSection: number) => {
    const letter = sectionToLetterMap[activeSection];
    if (letter) {
      router.push(`/${letter}`);
    }
  };


  const getSectionColor = useCallback((section: number) => 
    activeSection === section ? 'bg-zinc-300' : 'bg-zinc-200'
  , [activeSection]);

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
          <div className={`border border-zinc-300 border-t-0 ${getSectionColor(1)}`}></div>
          <div className={`border border-zinc-300 border-t-0 ${getSectionColor(2)}`}></div>
          <div className={`border border-zinc-300 border-l-0 ${getSectionColor(3)}`}></div>
          <div className={`border border-zinc-300 border-r-0 ${getSectionColor(4)}`}></div>
          <div className={`border border-zinc-300 border-b-0 ${getSectionColor(5)}`}></div>
          <div className={`border border-zinc-300 border-b-0 ${getSectionColor(6)}`}></div>
        </div>
        
        <motion.div
          className="w-20 h-20 rounded-full shadow-xl bg-zinc-100 cursor-grab active:cursor-grabbing z-10"
          drag
          dragConstraints={{
            top: -maxDistance,
            left: -maxDistance,
            right: maxDistance,
            bottom: maxDistance,
          }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={isDragging.current ? undefined : position}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ 
            width: smallCircleSize,
            height: smallCircleSize,
            x: position.x ,
            y: position.y,
          }}
        />
      </div>
    </div>
  );
}