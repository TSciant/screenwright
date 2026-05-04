'use client';

/**
 * StageView — React component that renders Actors from the Stage.
 *
 * Uses Framer Motion for GPU-accelerated positioning.
 * No layout thrashing. Smooth 60fps.
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Stage } from '../core/stage';
import { ActorState } from '../core/actor';
import Swipey from './Swipey';

interface StageViewProps {
  stage: Stage;
  className?: string;
}

export default function StageView({ stage, className = '' }: StageViewProps) {
  const [actors, setActors] = useState<ActorState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = stage.subscribe((newActors) => {
      setActors(newActors);
    });
    stage.play();
    return () => {
      unsubscribe();
      stage.stop();
    };
  }, [stage]);

  // Update stage dimensions on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        stage.config.width = rect.width;
        stage.config.height = rect.height;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [stage]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: stage.config.backgroundColor || '#0a0a0f',
      }}
    >
      {actors.map((actor) => {
        const pos = stage.toPixels(actor.x, actor.y);
        return (
          <motion.div
            key={actor.id}
            initial={false}
            animate={{
              x: pos.x,
              y: pos.y,
              rotate: actor.rotation,
              scale: actor.scale,
              opacity: actor.visible ? actor.opacity : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 20,
              mass: 1,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              translateX: '-50%',
              translateY: '-50%',
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          >
            {actor.type === 'swipey' && (
              <Swipey
                emotion={actor.emotion as any}
                size={80 * actor.scale}
                holding={actor.holding}
                holdPosition={actor.holdPosition as any}
                morph={actor.morph}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
