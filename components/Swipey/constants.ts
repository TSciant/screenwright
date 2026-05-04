'use client';

// Emotion color tokens used for faces and glow effects
export const EmotionColorTokens: Record<string, string> = {
  happy: '#00ff9c',
  sad: '#4169E1',
  angry: '#FF4500',
  excited: '#FF00FF',
  surprised: '#00FFFF',
  neutral: '#FFFFFF',
  default: '#00ff9c',
  crying: '#87CEEB',
  love: '#ff69b4',
  sleepy: '#9370DB',
  confused: '#20B2AA',
  wink: '#FFD700',
  error: '#ff004c',
  combat: '#ff004c',
  thinking: '#00c8ff',
  suspicious: '#ffc400',
  idle: '#00ff9c',
  annoyed: '#ff7700',
  focus: '#00a0ff',
  blink: '#00ff9c'
};

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'excited'
  | 'surprised'
  | 'neutral'
  | 'default'
  | 'crying'
  | 'love'
  | 'sleepy'
  | 'confused'
  | 'wink'
  | 'blink'
  | 'thinking'
  | 'curious'
  | 'idle'
  | 'error'
  | 'focus'
  | 'suspicious'
  | 'combat'
  | 'annoyed';

export const eyeIcons: Record<EmotionType, [string, string]> = {
  happy: ['◕', '◕'],
  sad: ['◔', '◔'],
  angry: ['◣', '◢'],
  excited: ['◉', '◉'],
  surprised: ['⊙', '⊙'],
  neutral: ['◯', '◯'],
  default: ['◯', '◯'],
  crying: ['╥', '╥'],
  blink: ['—', '—'],
  love: ['♥', '♥'],
  sleepy: ['◡', '◡'],
  confused: ['◑', '◐'],
  wink: ['◕', '—'],
  thinking: ['◔', '◔'],
  curious: ['O', 'O'],
  idle: ['◯', '◯'],
  error: ['◣', '◢'],
  focus: ['◉', '◉'],
  suspicious: ['◑', '◐'],
  combat: ['◣', '◢'],
  annoyed: ['◣', '◢']
};

export const mouthShapes: Record<EmotionType, string> = {
  happy: '◡',
  sad: '◠',
  angry: '□',
  excited: '◠',
  surprised: 'O',
  neutral: '—',
  default: '—',
  crying: '◠',
  love: '◡',
  sleepy: '◠',
  confused: '○',
  wink: '◡',
  blink: '◡',
  thinking: '○',
  curious: 'o',
  idle: '—',
  error: '□',
  focus: '—',
  suspicious: '○',
  combat: '□',
  annoyed: '□'
};

export const getColorForEmotion = (emotion: EmotionType): string => {
  return EmotionColorTokens[emotion] || EmotionColorTokens.default;
};
