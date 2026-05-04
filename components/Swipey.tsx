'use client';

/**
 * Swipey — The character component.
 *
 * Pure rendering with smooth Framer Motion transitions.
 * Supports throw arcs via physics engine integration.
 */

import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { getColorForEmotion, eyeIcons, mouthShapes, EmotionType } from './Swipey/constants';

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
  const itemAnim = useAnimation();
  const itemVisible = useRef(true);

  // Compute held item base position (registration point)
  const getItemBasePosition = useCallback(() => {
    const offset = size * 0.35;
    const c = size / 2;
    switch (holdPosition) {
      case 'topLeft': return { x: c - offset, y: c - offset, rotate: -15 };
      case 'topRight': return { x: c + offset, y: c - offset, rotate: 15 };
      case 'bottomLeft': return { x: c - offset, y: c + offset, rotate: -15 };
      case 'bottomRight': return { x: c + offset, y: c + offset, rotate: 15 };
      case 'center': return { x: c, y: c, rotate: 0 };
      default: return { x: c + offset, y: c - offset, rotate: 15 };
    }
  }, [size, holdPosition]);

  // Imperative handle for throw/dunk animations
  useImperativeHandle(ref, () => ({
    async throwItem(options = {}) {
      if (!holding) return;
      itemVisible.current = true;
      const base = getItemBasePosition();
      await itemAnim.start({
        x: base.x + (options.targetX ?? 200),
        y: base.y + (options.targetY ?? -150),
        rotate: base.rotate + 360,
        scale: 0.2,
        opacity: 0,
        transition: { duration: 0.8, ease: 'easeIn' },
      });
      itemVisible.current = false;
      options.onComplete?.();
    },
    async dunkItem(options = {}) {
      if (!holding) return;
      itemVisible.current = true;
      const base = getItemBasePosition();
      // Arc up then down
      await itemAnim.start({
        x: base.x,
        y: base.y - 200,
        rotate: base.rotate + 180,
        scale: 1.2,
        transition: { duration: 0.4, ease: 'easeOut' },
      });
      await itemAnim.start({
        x: base.x,
        y: base.y + 100,
        rotate: base.rotate + 360,
        scale: 0.3,
        opacity: 0,
        transition: { duration: 0.4, ease: 'easeIn' },
      });
      itemVisible.current = false;
      options.onComplete?.();
    },
  }));

  // Reset item animation when a new item is held
  React.useEffect(() => {
    if (holding && itemVisible.current === false) {
      itemVisible.current = true;
      const base = getItemBasePosition();
      itemAnim.set({ x: base.x, y: base.y, rotate: base.rotate, scale: 0, opacity: 0 });
      itemAnim.start({
        x: base.x,
        y: base.y,
        rotate: base.rotate,
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      });
    }
  }, [holding, itemAnim, getItemBasePosition]);

  const basePos = getItemBasePosition();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Body with breathing pulse */}
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
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
              className="flex flex-col items-center justify-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {/* Eyes */}
              <div className="flex gap-2 text-white leading-none" style={{ fontSize: size * 0.28 }}>
                <motion.span
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 0.15, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block"
                >
                  {leftEye}
                </motion.span>
                <motion.span
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 0.15, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block"
                >
                  {rightEye}
                </motion.span>
              </div>
              {/* Mouth */}
              <span
                className="text-white leading-none"
                style={{ fontSize: size * 0.22 }}
              >
                {mouth}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Held item — animated via useAnimation */}
      <AnimatePresence>
        {holding && (
          <motion.div
            className="absolute top-0 left-0 pointer-events-none"
            style={{ fontSize: size * 0.45 }}
            initial={{ scale: 0, opacity: 0, x: basePos.x, y: basePos.y, rotate: basePos.rotate - 45 }}
            animate={itemAnim}
            exit={{ scale: 0, opacity: 0, rotate: basePos.rotate + 45 }}
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
