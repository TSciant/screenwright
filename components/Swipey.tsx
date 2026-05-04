'use client';

/**
 * Swipey — The character component.
 *
 * Pure rendering. No state management, no animation logic.
 * Receives emotion, holding, morph, and renders accordingly.
 *
 * Animation is handled by Framer Motion based on prop changes.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getColorForEmotion, eyeIcons, mouthShapes, EmotionType } from './Swipey/constants';

interface SwipeyProps {
  emotion?: EmotionType;
  size?: number;
  holding?: string | null;
  holdPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  morph?: string | null;
}

export default function Swipey({
  emotion = 'idle',
  size = 80,
  holding = null,
  holdPosition = 'topRight',
  morph = null,
}: SwipeyProps) {
  const color = getColorForEmotion(emotion);
  const [leftEye, rightEye] = eyeIcons[emotion] || eyeIcons.idle;
  const mouth = mouthShapes[emotion] || mouthShapes.idle;

  // Determine what to render (morph overrides face)
  const renderContent = () => {
    if (morph) {
      return (
        <motion.div
          key={`morph-${morph}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ fontSize: size * 0.7 }}
        >
          {morph}
        </motion.div>
      );
    }

    return (
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={false}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Eyes */}
        <div className="flex gap-1 text-white" style={{ fontSize: size * 0.25 }}>
          <motion.span
            key={`eye-l-${emotion}`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2 }}
          >
            {leftEye}
          </motion.span>
          <motion.span
            key={`eye-r-${emotion}`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2 }}
          >
            {rightEye}
          </motion.span>
        </div>
        {/* Mouth */}
        <motion.span
          key={`mouth-${emotion}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-white"
          style={{ fontSize: size * 0.2 }}
        >
          {mouth}
        </motion.span>
      </motion.div>
    );
  };

  // Get holding position offset
  const getHoldingOffset = () => {
    const offset = size * 0.4;
    switch (holdPosition) {
      case 'topLeft': return { top: -offset, left: -offset };
      case 'topRight': return { top: -offset, right: -offset };
      case 'bottomLeft': return { bottom: -offset, left: -offset };
      case 'bottomRight': return { bottom: -offset, right: -offset };
      case 'center': return { top: 0, left: 0 };
      default: return { top: -offset, right: -offset };
    }
  };

  return (
    <div
      className="relative inline-flex items-center justify-center"
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
        initial={false}
        animate={{
          boxShadow: [
            `0 0 ${size * 0.3}px ${color}40`,
            `0 0 ${size * 0.5}px ${color}60`,
            `0 0 ${size * 0.3}px ${color}40`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </motion.div>

      {/* Held item */}
      <AnimatePresence>
        {holding && (
          <motion.div
            key={`hold-${holding}`}
            className="absolute"
            style={getHoldingOffset()}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span style={{ fontSize: size * 0.4 }}>{holding}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
