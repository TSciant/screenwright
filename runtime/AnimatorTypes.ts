export type EmotionType = 
  | 'happy' 
  | 'suspicious' 
  | 'annoyed' 
  | 'combat' 
  | 'blink' 
  | 'idle' 
  | 'error' 
  | 'thinking' 
  | 'love' 
  | 'focus' 
  | 'sleepy';

export type TrickType = 
  | 'flip' 
  | 'spin' 
  | 'bounce' 
  | 'shake' 
  | 'windmillDunk' 
  | 'turnaroundJumper' 
  | 'combat'
  | 'arcThrow'
  | 'lobThrow'
  | 'fastThrow'
  | 'spinThrow'
  | 'bounceThrow'
  | 'morphThrow';

export type HoldingPositionType = 
  | 'topLeft' 
  | 'topRight' 
  | 'bottomRight' 
  | 'bottomLeft' 
  | 'center';

export type ShapeModeType = 
  | 'circle' 
  | 'squircle';

export type AnimationEasing = 
  | 'linear'
  | 'easeInOut'
  | 'easeIn'
  | 'easeOut'
  | 'anticipate'
  | 'bounce'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  | 'custom'; // Custom curve defined by bezier points

export type SceneEntryExit = 
  | 'fade'
  | 'slide'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown'
  | 'bounce'
  | 'grow'
  | 'shrink'
  | 'teleport'
  | 'flip'
  | 'spin'
  | 'dropIn'       // Falls from above with gravity
  | 'popUp'        // Pops from below with springy motion
  | 'pushLeft'     // Pushed in from right with force
  | 'pushRight'    // Pushed in from left with force
  | 'pullLeft'     // Pulled in from left with elasticity
  | 'pullRight'    // Pulled in from right with elasticity
  | 'swingIn'      // Swings in like on a pendulum
  | 'springIn'     // Bouncy entrance with overshoot
  | 'fadeRotateIn' // Fades in while rotating
  | 'helicopter'   // Spins in from above like helicopter blades
  | 'portal'       // Sci-fi portal effect
  | 'fold'         // Unfolds like origami
  | 'explode'      // Appears with explosive particles
  | 'assemble';    // Appears piece by piece

export type ActorType = 
  | 'swipey'  // Default character
  | 'outtie'  // AI assistant character
  | 'robot'   // Mechanical character
  | 'shadow'  // Evil twin
  | 'custom'; // User-defined character

export type ScenePosition = 
  | 'left'
  | 'center'
  | 'right'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'offscreenLeft'
  | 'offscreenRight'
  | 'offscreenTop'
  | 'offscreenBottom';

export type PropType =
  | 'static'  // Non-interactive decoration
  | 'dynamic' // Interactive element
  | 'background'; // Environment element

export type PropInteraction =
  | 'grab'
  | 'throw'
  | 'use'
  | 'transform'
  | 'destroy'
  | 'create';

export type ThoughtBubbleStyle =
  | 'thought'
  | 'speech'
  | 'alert'
  | 'whisper';

export interface SceneProp {
  id: string;
  name: string;
  emoji?: string;
  imageUrl?: string;
  type: PropType;
  position: ScenePosition;
  size: number;
  interactable: boolean;
  interactions?: PropInteraction[];
}

export interface SwipeySceneStep {
  id: string;
  actorId: string;
  emotion?: EmotionType;
  quote?: string;
  thought?: string;
  thoughtStyle?: ThoughtBubbleStyle;
  morph?: string;
  holdingItem?: string | React.ReactNode;
  holdingPosition?: HoldingPositionType;
  trickType?: TrickType;
  position?: ScenePosition;
  duration?: number; // in milliseconds
  timing?: AnimationEasing | CustomEasingCurve;
  shapeMode?: ShapeModeType;
  size?: number;
  backfill?: boolean;
  waitForInput?: boolean; // When true, the scene will wait for user interaction to continue
  complexMotion?: ComplexMotionConfig; // Added complex motion pattern configuration
  interactionProps?: {
    propId: string;
    interaction: PropInteraction;
    targetPosition?: ScenePosition;
  }[];
  physics?: PhysicsProps;            // Physics properties for this step
  baw?: BAWProps;                    // Batman Action Words
  animationChain?: AnimationChainLink[]; // Primitive animations chain
  physicsMode?: 'step' | 'constant'; // Whether physics persist between steps
  throwPath?: 'arc' | 'parabola' | 'straight' | 'bounce' | 'spiral'; // Path for throwing items
  midThrowAction?: {                 // Actions that happen during a throw
    morph?: string;                  // Morph mid-air
    time?: number;                   // When during throw (0-1, percentage of throw duration)
    baw?: BAWProps;                  // BAW during throw
  };
  landingAction?: {                  // What happens when a thrown item lands
    bounce?: boolean;                // Whether item bounces on landing
    spin?: boolean;                  // Whether item spins on landing
    fizzle?: boolean;                // Whether item fizzles out on landing
    baw?: BAWProps;                  // BAW when landing
  };
}

export interface SwipeySceneActorEntrance {
  step: number; // At which step number the actor enters
  animation: SceneEntryExit;
  initialPosition: ScenePosition;
  duration?: number; // Override default duration
  timing?: AnimationEasing | CustomEasingCurve; // Override default timing
}

export interface SwipeySceneActorExit {
  step: number; // At which step number the actor exits
  animation: SceneEntryExit;
  finalPosition?: ScenePosition;
  duration?: number; // Override default duration
  timing?: AnimationEasing | CustomEasingCurve; // Override default timing
}

export interface SwipeySceneActor {
  id: string;
  type: ActorType;
  name: string;
  customType?: string;
  initialPosition: ScenePosition;
  size: number;
  isProtagonist?: boolean;
  color?: string;
  customImage?: string;
  entrance?: SwipeySceneActorEntrance;
  exit?: SwipeySceneActorExit;
}

export interface SwipeyMiniScene {
  id: string;
  name: string;
  description?: string;
  actors: SwipeySceneActor[];
  steps: SwipeySceneStep[];
  props: SceneProp[];
  loop?: boolean;
  duration?: number; // Total duration in milliseconds
  backgroundColor?: string;
  backgroundImage?: string;
  environment?: SceneEnvironment; // Scene environment/lighting context
  timeOfDay?: number; // 0-24 representing hour of day for lighting
  entryAnimation?: SceneEntryExit;
  exitAnimation?: SceneEntryExit;
  defaultTiming?: AnimationEasing | CustomEasingCurve; // Default easing for all animations
  tags?: string[]; // For filtering and categorization
  stageWidth?: number;
  stageHeight?: number;
  physics?: PhysicsProps;       // Global physics properties
  physicsMode?: 'on' | 'off';   // Whether physics are enabled scene-wide
}

export interface NaturalLanguageSceneParams {
  prompt: string;
  preferredEmotions?: EmotionType[];
  maxSteps?: number;
  duration?: number;
  actors?: SwipeySceneActor[];
  props?: SceneProp[];
}

export type ComplexMotionPattern =
  | 'dribble'        // Basketball dribbling motion
  | 'juggle'         // Juggling multiple objects
  | 'wave'           // Waving pattern (can be directional)
  | 'dance'          // Generic dance motion
  | 'pacing'         // Walking back and forth
  | 'orbit'          // Circular motion around a point
  | 'bounce'         // Bouncing up and down
  | 'shake'          // Shaking or vibrating
  | 'float'          // Floating slightly in place
  | 'zigzag'         // Moving in a zigzag pattern
  | 'spiral'         // Spiraling inward or outward
  | 'jitter'         // Random small movements
  | 'swing'          // Swinging like a pendulum
  | 'path';          // Custom motion path

export interface CustomEasingCurve {
  type: 'bezier';
  points: [number, number, number, number]; // cubic-bezier points (x1, y1, x2, y2)
}

export interface ComplexMotionConfig {
  pattern: ComplexMotionPattern;
  duration: number;
  iterations?: number;
  speed?: number;
  amplitude?: number;
  direction?: 'clockwise' | 'counterclockwise' | 'up' | 'down' | 'left' | 'right';
  customPath?: string; // SVG path for custom movement
  easing?: AnimationEasing | CustomEasingCurve;
  props?: string[]; // IDs of props involved in the motion
  endPosition?: ScenePosition;
}

export type SceneEnvironment = 
  | 'day'
  | 'night'
  | 'sunset'
  | 'sunrise'
  | 'space'
  | 'underwater'
  | 'rainy'
  | 'snowy'
  | 'foggy'
  | 'indoor'
  | 'stage';

export interface MadLibsSceneTemplate {
  id: string;
  template: string; // E.g. "[actor] [enters from] [direction] then [performs] [action]"
  slots: {
    actor: SwipeySceneActor[];
    direction: ScenePosition[];
    action: (TrickType | ComplexMotionPattern)[];
    emotion: EmotionType[];
    props: SceneProp[];
    // Additional slot types
  };
  generateScene: (filledSlots: Record<string, any>) => SwipeyMiniScene;
}

// Example scene templates
export const EXAMPLE_SCENES: SwipeyMiniScene[] = [
  {
    id: 'wave-hello',
    name: 'Wave Hello',
    description: 'A friendly wave and greeting',
    actors: [
      {
        id: 'swipey-main',
        type: 'swipey',
        name: 'Swipey',
        initialPosition: 'center',
        size: 125,
        isProtagonist: true
      }
    ],
    props: [],
    steps: [
      {
        id: 'step-1',
        actorId: 'swipey-main',
        emotion: 'happy',
        quote: 'Hi there!',
        duration: 1000
      },
      {
        id: 'step-2',
        actorId: 'swipey-main',
        emotion: 'happy',
        morph: '👋',
        duration: 1500
      },
      {
        id: 'step-3',
        actorId: 'swipey-main',
        emotion: 'happy',
        trickType: 'bounce',
        duration: 1200
      }
    ],
    duration: 3700,
    tags: ['greeting', 'friendly', 'intro']
  },
  {
    id: 'robot-battle',
    name: 'Robot Battle',
    description: 'Swipey confronts an evil robot clone',
    actors: [
      {
        id: 'swipey-hero',
        type: 'swipey',
        name: 'Swipey',
        initialPosition: 'left',
        size: 125,
        isProtagonist: true
      },
      {
        id: 'robot-villain',
        type: 'robot',
        name: 'RoboSwipe',
        initialPosition: 'right',
        size: 125,
        color: '#c0c0c0'
      }
    ],
    props: [
      {
        id: 'energy-orb',
        name: 'Energy Orb',
        emoji: '✨',
        type: 'dynamic',
        position: 'center',
        size: 30,
        interactable: true,
        interactions: ['grab', 'throw']
      }
    ],
    steps: [
      {
        id: 'step-1',
        actorId: 'swipey-hero',
        emotion: 'suspicious',
        quote: 'Who are you?',
        position: 'left',
        duration: 1200
      },
      {
        id: 'step-2',
        actorId: 'robot-villain',
        emotion: 'combat',
        quote: 'I am RoboSwipe, your replacement!',
        position: 'right',
        duration: 1500
      },
      {
        id: 'step-3',
        actorId: 'swipey-hero',
        emotion: 'combat',
        thought: 'I need to get the energy orb!',
        thoughtStyle: 'thought',
        position: 'left',
        duration: 1000
      },
      {
        id: 'step-4',
        actorId: 'swipey-hero',
        emotion: 'combat',
        trickType: 'bounce',
        position: 'center',
        interactionProps: [
          {
            propId: 'energy-orb',
            interaction: 'grab'
          }
        ],
        duration: 1000
      },
      {
        id: 'step-5',
        actorId: 'swipey-hero',
        emotion: 'happy',
        holdingItem: '✨',
        holdingPosition: 'topRight',
        position: 'center',
        duration: 800
      },
      {
        id: 'step-6',
        actorId: 'swipey-hero',
        emotion: 'combat',
        interactionProps: [
          {
            propId: 'energy-orb',
            interaction: 'throw',
            targetPosition: 'right'
          }
        ],
        position: 'left',
        duration: 1200
      },
      {
        id: 'step-7',
        actorId: 'robot-villain',
        emotion: 'error',
        trickType: 'shake',
        position: 'right',
        duration: 1500
      },
      {
        id: 'step-8',
        actorId: 'swipey-hero',
        emotion: 'happy',
        position: 'center',
        trickType: 'flip',
        quote: 'The day is saved!',
        duration: 2000
      }
    ],
    backgroundColor: '#333',
    duration: 10200,
    tags: ['action', 'battle', 'robot', 'story']
  },
  {
    id: 'tutorial-helper',
    name: 'Tutorial Helper',
    description: 'Swipey guides a user through a new feature',
    actors: [
      {
        id: 'swipey-guide',
        type: 'swipey',
        name: 'Swipey',
        initialPosition: 'bottomRight',
        size: 100,
        isProtagonist: true,
        entrance: {
          step: 0,
          animation: 'slideUp',
          initialPosition: 'bottomRight'
        }
      }
    ],
    props: [
      {
        id: 'ui-highlight',
        name: 'UI Highlight',
        type: 'dynamic',
        position: 'center',
        size: 200,
        interactable: false
      }
    ],
    steps: [
      {
        id: 'step-1',
        actorId: 'swipey-guide',
        emotion: 'happy',
        position: 'bottomRight',
        quote: 'Let me show you the new features!',
        duration: 2000
      },
      {
        id: 'step-2',
        actorId: 'swipey-guide',
        emotion: 'focus',
        holdingItem: '🔍',
        holdingPosition: 'topLeft',
        position: 'right',
        quote: 'First, check out this section',
        duration: 2500
      },
      {
        id: 'step-3',
        actorId: 'swipey-guide',
        emotion: 'love',
        position: 'bottomRight',
        quote: 'Great job! Now you know how it works!',
        trickType: 'bounce',
        duration: 2000
      }
    ],
    duration: 6500,
    tags: ['tutorial', 'guide', 'help']
  }
];

// Add physics types
export interface PhysicsProps {
  mass?: number;       // Object mass for momentum calculations (default: 1)
  gravity?: number;    // Vertical acceleration (default: 0.5)
  drag?: number;       // Horizontal resistance (default: 0.1)
  bounce?: number;     // Restitution on impact (0-1, default: 0.3)
  friction?: number;   // Ground friction for sliding (default: 0.1)
  wind?: number;       // Horizontal force (-1 to 1, default: 0)
  turbulence?: number; // Random movement factor (0-1, default: 0) 
}

// Add BAW (Batman Action Word) types
export interface BAWProps {
  text: string;             // The text to display
  size?: number;            // Size multiplier (default: 1)
  duration?: number;        // How long to show (ms, default: 800)
  style?: 'pop' | 'slam' | 'zoom' | 'shake' | 'float' | 'pulse'; // Animation style
  color?: string;           // Override color (default: based on emotion)
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center'; // Where to show relative to Swipey
}

// Add primitive animations that can be chained
export type AnimationPrimitive = 
  | 'roll'       // Roll in place
  | 'twist'      // Twist around center
  | 'squash'     // Flatten temporarily
  | 'stretch'    // Elongate temporarily
  | 'pulse'      // Quick scale up and down
  | 'wiggle'     // Small side-to-side movement
  | 'wobble'     // Irregular rotation movement
  | 'float'      // Hovering up and down slightly
  | 'shiver'     // Rapid small vibration
  | 'nod'        // Head nodding motion
  | 'rotate'     // Simple rotation
  | 'slide'      // Movement from A to B
  | 'fade'       // Opacity change
  | 'scale'      // Size change
  | 'skew'       // Shape distortion
  | 'jiggle'     // Loose wiggle motion
  | 'sway';      // Gentle side-to-side

// Add animation chain for sequencing primitives
export interface AnimationChainLink {
  primitive: AnimationPrimitive;
  duration?: number;
  delay?: number;
  easing?: AnimationEasing;
  intensity?: number;     // How strong the animation is (0-1)
  direction?: 'clockwise' | 'counterclockwise' | 'up' | 'down' | 'left' | 'right';
  repeat?: number;        // Number of times to repeat
  yoyo?: boolean;         // Whether to alternate direction on repeat
} 