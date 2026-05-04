/**
 * Director — Orchestrates scenes by sending signals to Actors on the Stage.
 *
 * The Director owns:
 * - Scene definitions (scripts)
 * - Timeline sequencing
 * - Event triggers (time-based, interaction-based)
 *
 * Scenes are declarative. The Director interprets them into actor signals.
 */

import { Stage } from './stage';
import { Actor, ActorSignal } from './actor';

export interface SceneStep {
  time: number; // ms from scene start
  actorId: string;
  signal: ActorSignal;
}

export interface Scene {
  id: string;
  name: string;
  steps: SceneStep[];
  loop?: boolean;
  duration?: number;
}

export class Director {
  private currentScene: Scene | null = null;
  private startTime = 0;
  private playedSteps = new Set<number>();
  private rafId: number | null = null;
  private sceneCompleteCallbacks: (() => void)[] = [];

  constructor(private stage: Stage) {}

  /** Load and play a scene */
  play(scene: Scene): void {
    this.stop();
    this.currentScene = scene;
    this.startTime = performance.now();
    this.playedSteps.clear();
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  /** Stop the current scene */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.currentScene = null;
  }

  /** Register a callback for when scene completes */
  onSceneComplete(fn: () => void): () => void {
    this.sceneCompleteCallbacks.push(fn);
    return () => {
      this.sceneCompleteCallbacks = this.sceneCompleteCallbacks.filter((c) => c !== fn);
    };
  }

  private tick(): void {
    if (!this.currentScene) return;

    const elapsed = performance.now() - this.startTime;
    const duration = this.currentScene.duration || Infinity;

    // Check for completed scene
    if (elapsed >= duration && !this.currentScene.loop) {
      this.sceneCompleteCallbacks.forEach((fn) => fn());
      this.stop();
      return;
    }

    // Loop if needed
    const effectiveTime = this.currentScene.loop ? elapsed % duration : elapsed;

    // Fire steps that are due
    for (let i = 0; i < this.currentScene.steps.length; i++) {
      if (this.playedSteps.has(i)) continue;
      const step = this.currentScene.steps[i];
      if (effectiveTime >= step.time) {
        const actor = this.stage.getActor(step.actorId);
        if (actor) {
          actor.signal(step.signal);
        }
        this.playedSteps.add(i);
      }
    }

    this.rafId = requestAnimationFrame(() => this.tick());
  }

  /** Send an ad-hoc signal to an actor */
  signal(actorId: string, signal: ActorSignal): void {
    const actor = this.stage.getActor(actorId);
    if (actor) actor.signal(signal);
  }

  /** Send a signal to all actors */
  broadcast(signal: ActorSignal): void {
    this.stage.actors.forEach((actor) => {
      actor.signal(signal);
    });
  }
}
