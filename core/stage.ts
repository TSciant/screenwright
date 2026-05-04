/**
 * Stage — The container where Actors live.
 *
 * The Stage owns:
 * - The viewport (dimensions, camera)
 * - The actor registry
 * - The render loop (requestAnimationFrame)
 * - Physics integration
 *
 * It does NOT own actor state. Actors are self-contained.
 * The Stage just orchestrates their existence and renders them.
 */

import { Actor, ActorState } from './actor';
import { PhysicsProps } from '../runtime/AnimatorTypes';

export interface StageConfig {
  width: number;
  height: number;
  backgroundColor?: string;
  gravity?: number;
  physics?: PhysicsProps;
}

export class Stage {
  actors = new Map<string, Actor>();
  private rafId: number | null = null;
  private lastTime = 0;
  private subscribers = new Set<(actors: ActorState[]) => void>();

  constructor(public config: StageConfig) {}

  /** Add an actor to the stage */
  addActor(actor: Actor): void {
    this.actors.set(actor.state.id, actor);
  }

  /** Remove an actor */
  removeActor(id: string): void {
    this.actors.delete(id);
  }

  /** Get an actor by ID */
  getActor(id: string): Actor | undefined {
    return this.actors.get(id);
  }

  /** Subscribe to render updates (gets called every frame) */
  subscribe(fn: (actors: ActorState[]) => void): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  /** Start the render loop */
  play(): void {
    if (this.rafId !== null) return;
    const loop = (now: number) => {
      const dt = this.lastTime ? (now - this.lastTime) / 1000 : 0;
      this.lastTime = now;
      this.tick(dt);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  /** Stop the render loop */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Single frame update */
  private tick(dt: number): void {
    // Collect all actor states
    const states: ActorState[] = [];
    this.actors.forEach((actor) => {
      states.push(actor.getRenderState());
    });
    // Broadcast to all subscribers (React components, etc.)
    this.subscribers.forEach((fn) => fn(states));
  }

  /** Convert normalized coordinates to pixels */
  toPixels(x: number, y: number): { x: number; y: number } {
    return {
      x: x * this.config.width,
      y: y * this.config.height,
    };
  }

  /** Convert pixels to normalized coordinates */
  toNormalized(px: number, py: number): { x: number; y: number } {
    return {
      x: px / this.config.width,
      y: py / this.config.height,
    };
  }
}
