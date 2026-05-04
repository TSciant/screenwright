'use client';

/**
 * Swipey — The character component.
 *
 * Pure rendering with smooth Framer Motion transitions.
 * Cybernetic: organic glow rings, undulating body, alive aura.
 * Held items float with ambient motion and arc on throw/dunk.
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
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
  const itemPresent = useRef(false);

  // Held item base position (registration point)
  const getItemBase = () => {
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
  };

  const base = getItemBase();

  // Imperative handle for throw/dunk
  useImperativeHandle(ref, () => ({
    async throwItem(options = {}) {
      if (!itemPresent.current) return;
      const tx = base.x + (options.targetX ?? 300);
      const ty = base.y + (options.targetY ?? -180);
      await itemAnim.start({
        x: [base.x, base.x + (tx - base.x) * 0.5, tx],
        y: [base.y, base.y - 120, ty],
        rotate: [base.rotate + Math.sin(Date.now() / 500) * 10, base.rotate + 180, base.rotate + 360],
        scale: [1, 1.1, 0.2],
        opacity: [1, 1, 0],
        transition: { duration: 0.7, ease: 'easeInOut' },
      });
      itemPresent.current = false;
      options.onComplete?.();
    },
    async dunkItem(options = {}) {
      if (!itemPresent.current) return;
      // Arc up
      await itemAnim.start({
        x: [base.x, base.x + 40, base.x - 40, base.x],
        y: [base.y, base.y - 160, base.y - 180, base.y + 80],
        rotate: [base.rotate, base.rotate + 270, base.rotate + 540, base.rotate + 720],
        scale: [1, 1.15, 0.8, 0.2],
        opacity: [1, 1, 0.8, 0],
        transition: { duration: 0.9, times: [0, 0.35, 0.6, 1], ease: 'easeInOut' },
      });
      itemPresent.current = false;
      options.onComplete?.();
    },
  }));

  // Track item presence for animation logic
  React.useEffect(() => {
    if (holding) {
      itemPresent.current = true;
      itemAnim.set({ x: base.x, y: base.y, rotate: base.rotate, scale: 0, opacity: 0 });
      itemAnim.start({
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 18 },
      });
    } else {
      itemAnim.start({
        scale: 0,
        opacity: 0,
        rotate: base.rotate + 45,
        transition: { duration: 0.2 },
      }).then(() => {
        itemPresent.current = false;
      });
    }
  }, [holding, itemAnim, base]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Aura rings */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `1px solid ${color}15`, margin: -size * 0.15 }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `1.5px solid ${color}25`, margin: -size * 0.08 }}
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: `0 0 ${size * 0.2}px ${color}30` }}
        animate={{
          boxShadow: [
            `0 0 ${size * 0.2}px ${color}30`,
            `0 0 ${size * 0.4}px ${color}55`,
            `0 0 ${size * 0.2}px ${color}30`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Body with organic undulation */}
      <motion.div
        className="rounded-2xl flex items-center justify-center relative overflow-hidden"
        style={{ width: size, height: size, backgroundColor: color }}
        animate={{
          scaleX: [1, 1.03, 0.97, 1],
          scaleY: [1, 0.97, 1.03, 1],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 40% 40%, ${color}90 0%, ${color}60 50%, ${color}40 100%)` }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: size * 0.6, height: size * 0.6,
            background: `radial-gradient(circle, ${color}cc 0%, transparent 70%)`,
            top: size * 0.15, left: size * 0.15, filter: 'blur(4px)',
          }}
        />

        <AnimatePresence mode="wait" initial={false}>
          {morph ? (
            <motion.div
              key={`morph-${morph}`}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ fontSize: size * 0.7, position: 'relative', zIndex: 10 }}
            >
              {morph}
            </motion.div>
          ) : (
            <motion.div
              key={`face-${emotion}`}
              className="flex flex-col items-center justify-center gap-1 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
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
              <span className="text-white leading-none" style={{ fontSize: size * 0.22 }}>
                {mouth}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Held item — animated via useAnimation for throw/dunk arcs */}
      <AnimatePresence>
        {holding && (
          <motion.div
            className="absolute top-0 left-0 pointer-events-none"
            style={{ fontSize: size * 0.45 }}
            animate={itemAnim}
            exit={{ scale: 0, opacity: 0, rotate: base.rotate + 45, transition: { duration: 0.2 } }}
          >
              <motion.span
                animate={{
                  y: [0, -3, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                {holding}
              </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Swipey.displayName = 'Swipey';
export default Swipey;
