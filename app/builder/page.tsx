'use client';

/**
 * Builder — Interactive scene authoring UI.
 *
 * NOT YET IMPLEMENTED.
 * This is a placeholder for the visual scene builder.
 */

import React from 'react';

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Scene Builder 🛠️</h1>
        <p className="text-gray-400">
          The visual scene builder is under construction.
          <br />
          For now, define scenes in code using the{' '}
          <code className="bg-gray-800 px-2 py-1 rounded">Director</code> API.
        </p>

        <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <pre className="text-sm text-gray-300 overflow-auto">
{`const scene: Scene = {
  id: 'my-scene',
  name: 'My Scene',
  steps: [
    { time: 0, actorId: 'swipey-1', signal: {
      type: 'emotion', payload: 'happy'
    }},
    { time: 500, actorId: 'swipey-1', signal: {
      type: 'move', payload: { x: 0.5, y: 0.5 }
    }},
  ],
  duration: 1000,
};

director.play(scene);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
