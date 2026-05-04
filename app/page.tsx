'use client';

/**
 * Demo page — Shows the Stage + Actor + Director system in action.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Stage } from '../core/stage';
import { Actor } from '../core/actor';
import { Director, Scene } from '../core/director';
import StageView from '../components/StageView';

export default function DemoPage() {
  const [stage] = useState(() => new Stage({
    width: 800,
    height: 600,
    backgroundColor: '#0a0a0f',
  }));

  const [director] = useState(() => new Director(stage));
  const [playing, setPlaying] = useState(false);

  // Create actors
  useEffect(() => {
    const swipey = new Actor({
      id: 'swipey-1',
      type: 'swipey',
      initialState: {
        emotion: 'idle',
        x: 0.2,
        y: 0.5,
        scale: 1,
      },
    });

    const outtie = new Actor({
      id: 'outtie-1',
      type: 'outtie',
      initialState: {
        emotion: 'happy',
        x: 0.8,
        y: 0.5,
        scale: 1.2,
      },
    });

    stage.addActor(swipey);
    stage.addActor(outtie);

    return () => {
      stage.removeActor('swipey-1');
      stage.removeActor('outtie-1');
    };
  }, [stage]);

  // Define scenes
  const scenes: Record<string, Scene> = {
    'greeting': {
      id: 'greeting',
      name: 'Greeting',
      steps: [
        { time: 0, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'happy' } },
        { time: 0, actorId: 'swipey-1', signal: { type: 'hold', payload: { item: '👋' } } },
        { time: 500, actorId: 'outtie-1', signal: { type: 'emotion', payload: 'love' } },
        { time: 1000, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'idle' } },
        { time: 1500, actorId: 'swipey-1', signal: { type: 'hold', payload: { item: null } } },
      ],
      duration: 2000,
    },
    'walk-across': {
      id: 'walk-across',
      name: 'Walk Across',
      steps: [
        { time: 0, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'focus' } },
        { time: 0, actorId: 'swipey-1', signal: { type: 'move', payload: { x: 0.2, y: 0.5 } } },
        { time: 500, actorId: 'swipey-1', signal: { type: 'move', payload: { x: 0.5, y: 0.3 } } },
        { time: 1000, actorId: 'swipey-1', signal: { type: 'move', payload: { x: 0.8, y: 0.5 } } },
        { time: 1500, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'happy' } },
      ],
      duration: 2000,
    },
    'morph-show': {
      id: 'morph-show',
      name: 'Morph Show',
      steps: [
        { time: 0, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'thinking' } },
        { time: 0, actorId: 'swipey-1', signal: { type: 'morph', payload: '🔮' } },
        { time: 1000, actorId: 'swipey-1', signal: { type: 'morph', payload: '🚀' } },
        { time: 2000, actorId: 'swipey-1', signal: { type: 'morph', payload: '💡' } },
        { time: 3000, actorId: 'swipey-1', signal: { type: 'morph', payload: null } },
        { time: 3000, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'happy' } },
      ],
      duration: 3500,
    },
    'confrontation': {
      id: 'confrontation',
      name: 'Confrontation',
      steps: [
        { time: 0, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'suspicious' } },
        { time: 0, actorId: 'outtie-1', signal: { type: 'emotion', payload: 'suspicious' } },
        { time: 500, actorId: 'swipey-1', signal: { type: 'move', payload: { x: 0.35, y: 0.5 } } },
        { time: 500, actorId: 'outtie-1', signal: { type: 'move', payload: { x: 0.65, y: 0.5 } } },
        { time: 1000, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'combat' } },
        { time: 1000, actorId: 'outtie-1', signal: { type: 'emotion', payload: 'combat' } },
        { time: 1500, actorId: 'swipey-1', signal: { type: 'hold', payload: { item: '⚔️' } } },
        { time: 1500, actorId: 'outtie-1', signal: { type: 'hold', payload: { item: '🛡️' } } },
        { time: 2500, actorId: 'swipey-1', signal: { type: 'emotion', payload: 'happy' } },
        { time: 2500, actorId: 'outtie-1', signal: { type: 'emotion', payload: 'happy' } },
      ],
      duration: 3000,
    },
  };

  const playScene = useCallback((sceneId: string) => {
    const scene = scenes[sceneId];
    if (scene) {
      director.play(scene);
      setPlaying(true);
      // Reset playing state after scene duration
      setTimeout(() => setPlaying(false), scene.duration || 2000);
    }
  }, [director, scenes]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ScreenWright 🎭</h1>
          <p className="text-gray-400">Stage + Actor + Director system demo</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stage */}
          <div className="lg:col-span-2">
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <StageView stage={stage} className="w-full h-[400px] lg:h-[500px]" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <h2 className="font-semibold mb-4">Scenes</h2>
              <div className="space-y-2">
                {Object.values(scenes).map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => playScene(scene.id)}
                    disabled={playing}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      playing
                        ? 'opacity-50 cursor-not-allowed bg-gray-800'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{scene.name}</div>
                    <div className="text-sm text-gray-500">{scene.duration}ms • {scene.steps.length} steps</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <h2 className="font-semibold mb-2">Direct Control</h2>
              <div className="grid grid-cols-3 gap-2">
                {['happy', 'sad', 'angry', 'love', 'combat', 'thinking', 'suspicious', 'focus', 'idle'].map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => {
                      director.signal('swipey-1', { type: 'emotion', payload: emotion });
                    }}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm capitalize"
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <h2 className="font-semibold mb-2">Hold Items</h2>
              <div className="flex flex-wrap gap-2">
                {['🏀', '⚔️', '🛡️', '💡', '🚀', '🔮', '👋', '💣', '🎾', null].map((item) => (
                  <button
                    key={item || 'none'}
                    onClick={() => {
                      director.signal('swipey-1', { type: 'hold', payload: { item } });
                    }}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-lg"
                  >
                    {item || '✕'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
