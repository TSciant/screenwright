# ScreenWright 🎭

A modular, emotionally expressive animation runtime for the modern web.

## Architecture

```
Stage → owns Actors, renders at 60fps
  ↓
Actor → holds state, receives signals
  ↓
Director → sends signals, orchestrates scenes
  ↓
StageView → React component, subscribes to Stage state stream
```

## Key Principles

1. **Stage is the container** — owns viewport, actor registry, render loop
2. **Actor holds state** — emotion, position, holding, morph. Receives signals, updates state.
3. **Director orchestrates** — loads scenes, sends timed signals to actors
4. **React is the renderer** — StageView subscribes to state stream, renders Swipey characters
5. **Framer Motion handles motion** — between prop changes (emotion, position, etc.)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the demo with 4 scenes and direct controls.

## Create a Scene

```typescript
import { Scene } from './core/director';

const myScene: Scene = {
  id: 'greeting',
  name: 'Greeting',
  steps: [
    { time: 0, actorId: 'swipey-1', signal: {
      type: 'emotion', payload: 'happy'
    }},
    { time: 500, actorId: 'swipey-1', signal: {
      type: 'hold', payload: { item: '👋' }
    }},
  ],
  duration: 1000,
};

director.play(myScene);
```

## Status

- ✅ Stage + Actor + Director core
- ✅ Swipey character component (emotion, holding, morph)
- ✅ StageView React bridge
- ✅ Demo page with 4 scenes
- ✅ Direct emotion/item controls
- 🚧 Scene authoring UI (placeholder)
- 🚧 Physics integration
- 🚧 Multiple actor types
- 🚧 Script parser (JSON → Scene)

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Framer Motion
- Tailwind CSS

---

Built with 💡 from the best pieces.
