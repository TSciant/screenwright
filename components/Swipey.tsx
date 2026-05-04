'use client';

/**
 * Swipey — The character component.
 *
 * Pure rendering with smooth Framer Motion transitions.
 * Supports throw arcs via physics engine integration.
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getColorForEmotion, eyeIcons, mouthShapes, EmotionType } from './Swipey/constants';
import { SwipeyPhysicsEngine } from '../physics/physics.engine';

interface SwipeyProps {
  emotion?: EmotionType;
  size?: number;
  holding?: string | null;
  holdPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  morph?: string | null;
}

export interface SwipeyRef {
  throwItem: (options?: ThrowOptions) => Promise<void>;
  dunkItem: (options?: ThrowOptions) => Promise<void>;
}

interface ThrowOptions {
  targetX?: number;
  targetY?: number;
  arcType?: 'arc' | 'parabola' | 'straight' | 'bounce' | 'spiral';
  onComplete?: () => void;
}

const Swipey = forwardRef<SwipeyRef, SwipeyProps>(function Swipey({
  emotion = 'idle',
  size = 80,
  holding = null,
  holdPosition = 'topRight',
  morph = null,
}, ref) {
  const color = getColorForEmotion(emotion);
  const [leftEye, rightEye] = eyeIcons[emotion] || eyeIcons.idle;
  const mouth = mouthShapes[emotion] || mouthShapes.idle;
  const itemRef = useRef<HTMLDivElement>(null);

  // Imperative handle for throw/dunk animations
  useImperativeHandle(ref, () => ({
    async throwItem(options = {}) {
      if (!itemRef.current || !holding) return;
      const physics = new SwipeyPhysicsEngine({ gravity: 0.5 });
      const path = physics.calculateThrowArc(
        0, 0,
        options.targetX || 300, options.targetY || -200,
        options.arcType || 'arc'
      );
      // Animate through path points
      for (const point of path) {
        if (itemRef.current) {
          itemRef.current.style.transform = `translate(${point.x}px, ${point.y}px)`;
        }
        await new Promise((r) => setTimeout(r, 16));
      }
      options.onComplete?.();
    },
    async dunkItem(options = {}) {
      // Dunk = throw up with high arc
      return (this as any).throwItem({
        ...options,
        targetY: -400,
        arcType: 'parabola',
      });
    },
  }));

  // Held item positioning with registration point
  const getItemTransform = () => {
    const offset = size * 0.35;
    const center = size / 2;
    switch (holdPosition) {
      case 'topLeft': return `translate(${center - offset}px, ${center - offset}px) rotate(-15deg)`;
      case 'topRight': return `translate(${center + offset}px, ${center - offset}px) rotate(15deg)`;
      case 'bottomLeft': return `translate(${center - offset}px, ${center + offset}px) rotate(-15deg)`;
      case 'bottomRight': return `translate(${center + offset}px, ${center + offset}px) rotate(15deg)`;
      case 'center': return `translate(${center}px, ${center}px) rotate(0deg)`;
      default: return `translate(${center + offset}px, ${center - offset}px) rotate(15deg)`;
    }
  };

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Body */}
      <motion.div
        className="rounded-2xl flex items-center justify-center"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 0.3}px ${color}40`,
        }}
        animate={{
          boxShadow: [
            `0 0 ${size * 0.3}px ${color}40`,
            `0 0 ${size * 0.5}px ${color}60`,
            `0 0 ${size * 0.3}px ${color}40`,
          ],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {morph ? (
            <motion.div
              key={`morph-${morph}`}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ fontSize: size * 0.7 }}
            >
              {morph}
            </motion.div>
          ) : (
            <motion.div
              key={`face-${emotion}`}
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {/* Eyes */}
              <div className="flex gap-1 text-white" style={{ fontSize: size * 0.25 }}>
                <motion.span
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 0.15, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {leftEye}
                </motion.span>
                <motion.span
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 0.15, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {rightEye}
                </motion.span>
              </div>
              {/* Mouth */}
              <motion.span
                className="text-white"
                style={{ fontSize: size * 0.2 }}
                layout
              >
                {mouth}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Held item — positioned with transform registration point */}
      <AnimatePresence>
        {holding && (
          <motion.div
            ref={itemRef}
            className="absolute top-0 left-0"
            style={{
              fontSize: size * 0.4,
              transform: getItemTransform(),
              transformOrigin: 'center center',
            }}
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 45, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            layout
          >
            {holding}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Swipey.displayName = 'Swipey';
export default Swipey;
