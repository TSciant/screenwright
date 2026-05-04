/**
 * Simple looping timeline engine for nested timelines and UI sync.
 * Emits the current time (ms) within a fixed-duration loop.
 * Optionally stores keyframe times for integration with editor UIs.
 */
export class TimelineEngine {
  private duration: number;
  private keyframes?: number[];
  private time = 0;
  private rafId: number | null = null;
  private subscribers = new Set<(t: number) => void>();

  constructor(duration: number, keyframes?: number[]) {
    this.duration = duration;
    this.keyframes = keyframes;
  }

  /** Subscribe to timeline ticks (time in ms). */
  subscribe(fn: (t: number) => void): () => void {
    this.subscribers.add(fn);
    return () => void this.subscribers.delete(fn);
  }

  /** Start the looping timeline. */
  play(): void {
    const start = performance.now() - this.time;
    const loop = (now: number) => {
      this.time = (now - start) % this.duration;
      this.subscribers.forEach((fn) => fn(this.time));
      this.rafId = requestAnimationFrame(loop);
    };
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(loop);
    }
  }

  /** Stop the timeline. */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Reset timeline to zero. */
  reset(): void {
    this.time = 0;
  }

  /**
   * Return the array of keyframe times if provided.
   * These can be used by UI components like the TimelineEditor
   * for initial track generation.
   */
  getKeyframes(): number[] | undefined {
    return this.keyframes;
  }
}
