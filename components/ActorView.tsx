'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ActorState } from '../core/actor';
import Swipey, { SwipeyRef } from './Swipey';
import { registerSwipeyRef, unregisterSwipeyRef } from '../core/swipeyRefRegistry';

interface ActorViewProps {
  actor: ActorState;
  pos: { x: number; y: number };
}

export default function ActorView({ actor, pos }: ActorViewProps) {
  const swipeyRef = useRef<SwipeyRef>(null);
  
  useEffect(() => {
    registerSwipeyRef(actor.id, swipeyRef);
    return () => unregisterSwipeyRef(actor.id);
  }, [actor.id]);
  
  return (
    <motion.div
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
          ref={swipeyRef}
          emotion={actor.emotion as any}
          size={80 * actor.scale}
          holding={actor.holding}
          holdPosition={actor.holdPosition as any}
          morph={actor.morph}
        />
      )}
    </motion.div>
  );
}
