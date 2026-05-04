/**
 * Actor — A character on the Stage.
 *
 * An Actor is a reactive entity that receives signals from the Director
 * and produces visual output. Actors don't hold UI state directly;
 * they hold *intent* state (emotion, position, holding) that the
 * Stage renders.
 */

export interface ActorSignal {
  type: 'emotion' | 'move' | 'hold' | 'throw' | 'trick' | 'morph' | 'speak' | 'physics';
  payload: unknown;
  duration?: number;
  easing?: string;
  after?: () => void;
}

export interface ActorState {
  id: string;
  type: 'swipey' | 'outtie' | 'custom';
  emotion: string;
  x: number;           // 0-1, normalized stage position
  y: number;
  scale: number;
  rotation: number;
  holding: string | null;
  holdPosition: string;
  morph: string | null;
  opacity: number;
  visible: boolean;
}

export interface ActorConfig {
  id: string;
  type?: ActorState['type'];
  initialState: Partial<ActorState>;
}

export class Actor {
  state: ActorState;
  private signalQueue: ActorSignal[] = [];
  private processing = false;

  constructor(config: ActorConfig) {
    this.state = {
      id: config.id,
      type: config.type || 'swipey',
      emotion: 'idle',
      x: 0.5,
      y: 0.5,
      scale: 1,
      rotation: 0,
      holding: null,
      holdPosition: 'topRight',
      morph: null,
      opacity: 1,
      visible: true,
      ...config.initialState,
    };
  }

  /** Receive a signal from the Director */
  signal(sig: ActorSignal): void {
    this.signalQueue.push(sig);
    if (!this.processing) this.processQueue();
  }

  /** Process queued signals */
  private async processQueue(): Promise<void> {
    this.processing = true;
    while (this.signalQueue.length > 0) {
      const sig = this.signalQueue.shift()!;
      await this.applySignal(sig);
    }
    this.processing = false;
  }

  /** Apply a single signal to state */
  private async applySignal(sig: ActorSignal): Promise<void> {
    switch (sig.type) {
      case 'emotion':
        this.state.emotion = sig.payload as string;
        break;
      case 'move':
        const { x, y } = sig.payload as { x: number; y: number };
        this.state.x = x;
        this.state.y = y;
        break;
      case 'hold':
        const hold = sig.payload as { item: string | null; position?: string };
        this.state.holding = hold.item;
        if (hold.position) this.state.holdPosition = hold.position;
        break;
      case 'morph':
        this.state.morph = sig.payload as string;
        break;
      case 'speak':
        // Speech bubbles handled by Stage overlay
        break;
      case 'physics':
        // Physics impulses handled by Stage
        break;
    }
    sig.after?.();
  }

  /** Get current renderable state */
  getRenderState(): ActorState {
    return { ...this.state };
  }
}
