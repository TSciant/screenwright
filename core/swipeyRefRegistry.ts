/**
 * SwipeyRefRegistry — Maps actor IDs to Swipey component refs.
 * Used for imperative actions (throw, dunk) from the Actor/Director layer.
 */

import { SwipeyRef } from '../components/Swipey';

const registry = new Map<string, React.RefObject<SwipeyRef | null>>();

export function registerSwipeyRef(actorId: string, ref: React.RefObject<SwipeyRef | null>): void {
  registry.set(actorId, ref);
}

export function unregisterSwipeyRef(actorId: string): void {
  registry.delete(actorId);
}

export function getSwipeyRef(actorId: string): React.RefObject<SwipeyRef | null> | undefined {
  return registry.get(actorId);
}
