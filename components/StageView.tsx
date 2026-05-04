'use client';

/**
 * StageView — React component that renders Actors from the Stage.
 *
 * This is the ONLY React component that knows about DOM rendering.
 * It subscribes to the Stage's state stream and renders each Actor
 * as a Swipey (or other actor component).
 */

import React, { useEffect, useState, useRef } from 'react';
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
    // Subscribe to stage updates
    const unsubscribe = stage.subscribe((newActors) => {
      setActors(newActors);
    });

    // Start the stage render loop
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
          <div
            key={actor.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) rotate(${actor.rotation}deg) scale(${actor.scale})`,
              opacity: actor.opacity,
              pointerEvents: 'none',
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
          </div>
        );
      })}
    </div>
  );
}
