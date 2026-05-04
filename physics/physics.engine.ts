'use client';

import { PhysicsProps } from '../runtime/AnimatorTypes';

/**
 * SwipeyPhysicsEngine - A sophisticated physics engine for SwipeyV3 animations
 * 
 * This provides advanced physics calculations for:
 * - Throw trajectories with varying arcs and realistic physics
 * - Bouncing objects with mass, gravity, and energy conservation
 * - Movement with drag, wind, turbulence, and air resistance
 * - Realistic landing effects with squash and stretch
 * - Advanced easing curves for natural motion
 */
export class SwipeyPhysicsEngine {
  // Enhanced default physics values
  static DEFAULT_PHYSICS: Required<PhysicsProps> = {
    mass: 1,
    gravity: 0.8,
    drag: 0.15,
    bounce: 0.4,
    friction: 0.12,
    wind: 0,
    turbulence: 0
  };

  // Current physics state
  private _physics: Required<PhysicsProps>;
  private _velocity = { x: 0, y: 0 };
  private _position = { x: 0, y: 0 };
  private _grounded = false;
  private _lastTime = 0;
  private _energy = 0;
  private _bounceCount = 0;
  private _maxBounces = 3;

  constructor(physics?: PhysicsProps) {
    this._physics = {
      ...SwipeyPhysicsEngine.DEFAULT_PHYSICS,
      ...physics
    };
  }

  /**
   * Advanced easing functions for natural motion
   */
  private static easingFunctions = {
    // Smooth acceleration and deceleration
    smooth: (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    // Elastic bounce effect
    elastic: (t: number): number => {
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },
    
    // Bounce with energy loss
    bounce: (t: number): number => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    },
    
    // Custom cubic bezier for natural motion
    natural: (t: number): number => {
      return t * t * (3 - 2 * t);
    },
    
    // Overshoot and settle
    overshoot: (t: number): number => {
      const s = 1.70158;
      return t * t * ((s + 1) * t - s);
    }
  };

  /**
   * Update physics properties
   */
  updatePhysics(physics: Partial<PhysicsProps>): void {
    this._physics = {
      ...this._physics,
      ...physics
    };
  }

  /**
   * Reset the physics engine to initial state
   */
  reset(position = { x: 0, y: 0 }, velocity = { x: 0, y: 0 }): void {
    this._position = { ...position };
    this._velocity = { ...velocity };
    this._grounded = false;
    this._lastTime = 0;
    this._energy = 0;
    this._bounceCount = 0;
  }

  /**
   * Set the initial position
   */
  setPosition(x: number, y: number): void {
    this._position = { x, y };
  }

  /**
   * Set initial velocity
   */
  setVelocity(x: number, y: number): void {
    this._velocity = { x, y };
  }

  /**
   * Apply a force to the object with momentum conservation
   */
  applyForce(fx: number, fy: number): void {
    // F = ma, so a = F/m
    const ax = fx / this._physics.mass;
    const ay = fy / this._physics.mass;
    
    // Apply acceleration to velocity with momentum conservation
    this._velocity.x += ax;
    this._velocity.y += ay;
    
    // Calculate kinetic energy
    this._energy = 0.5 * this._physics.mass * (this._velocity.x * this._velocity.x + this._velocity.y * this._velocity.y);
  }

  /**
   * Apply an impulse (immediate change in velocity) with energy conservation
   */
  applyImpulse(ix: number, iy: number): void {
    this._velocity.x += ix / this._physics.mass;
    this._velocity.y += iy / this._physics.mass;
    
    // Recalculate energy
    this._energy = 0.5 * this._physics.mass * (this._velocity.x * this._velocity.x + this._velocity.y * this._velocity.y);
  }

  /**
   * Calculate the next position based on advanced physics
   */
  update(deltaTime: number): { x: number, y: number, grounded: boolean, energy: number } {
    if (this._lastTime === 0) {
      this._lastTime = deltaTime;
      return { ...this._position, grounded: this._grounded, energy: this._energy };
    }

    const dt = (deltaTime - this._lastTime) / 1000; // Convert to seconds
    this._lastTime = deltaTime;

    // Apply gravity with realistic acceleration
    this._velocity.y += this._physics.gravity * dt * 9.8;

    // Apply wind with turbulence
    this._velocity.x += this._physics.wind * dt;

    // Apply advanced turbulence (random motion with frequency)
    if (this._physics.turbulence > 0) {
      const turbulenceX = (Math.random() * 2 - 1) * this._physics.turbulence * dt;
      const turbulenceY = (Math.random() * 2 - 1) * this._physics.turbulence * dt;
      
      // Apply turbulence with frequency-based variation
      const frequency = 0.1;
      this._velocity.x += turbulenceX * Math.sin(deltaTime * frequency);
      this._velocity.y += turbulenceY * Math.cos(deltaTime * frequency);
    }

    // Apply advanced drag (air resistance) with velocity-squared dependence
    const speed = Math.sqrt(this._velocity.x * this._velocity.x + this._velocity.y * this._velocity.y);
    const dragForce = this._physics.drag * speed * speed;
    
    if (speed > 0) {
      this._velocity.x -= (this._velocity.x / speed) * dragForce * dt;
      this._velocity.y -= (this._velocity.y / speed) * dragForce * dt;
    }

    // Update position with velocity integration
    this._position.x += this._velocity.x * dt * 100; // Scale factor for pixels
    this._position.y += this._velocity.y * dt * 100; // Scale factor for pixels

    // Enhanced ground collision with energy conservation
    if (this._position.y >= 0 && this._velocity.y > 0) {
      // Object has hit the ground
      this._grounded = true;
      this._position.y = 0; // Reset to ground level
      
      // Apply bounce with energy loss and bounce count limit
      if (this._physics.bounce > 0 && Math.abs(this._velocity.y) > 0.1 && this._bounceCount < this._maxBounces) {
        // Calculate energy loss per bounce
        const energyLoss = 0.2; // 20% energy loss per bounce
        const bounceFactor = this._physics.bounce * Math.pow(1 - energyLoss, this._bounceCount);
        
        this._velocity.y = -this._velocity.y * bounceFactor;
        this._bounceCount++;
        
        // Apply horizontal friction on bounce
        this._velocity.x *= (1 - this._physics.friction * dt * 15);
      } else {
        this._velocity.y = 0;
      }
      
      // Apply enhanced friction to x velocity when on ground
      if (this._grounded) {
        this._velocity.x *= (1 - this._physics.friction * dt * 10);
        
        // Stop if moving very slowly
        if (Math.abs(this._velocity.x) < 0.1) {
          this._velocity.x = 0;
        }
      }
    } else {
      this._grounded = false;
    }
    
    // Update energy
    this._energy = 0.5 * this._physics.mass * (this._velocity.x * this._velocity.x + this._velocity.y * this._velocity.y);
    
    return {
      x: this._position.x,
      y: this._position.y,
      grounded: this._grounded,
      energy: this._energy
    };
  }

  /**
   * Calculate an advanced throw arc path with realistic physics
   */
  calculateThrowArc(
    startX: number, 
    startY: number, 
    targetX: number, 
    targetY: number, 
    type: 'arc' | 'parabola' | 'straight' | 'bounce' | 'spiral' = 'parabola',
    steps: number = 60
  ): { x: number, y: number, velocity: { x: number, y: number } }[] {
    const path: { x: number, y: number, velocity: { x: number, y: number } }[] = [];
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate initial velocity based on distance and physics with energy conservation
    // Ensure upward trajectory by calculating proper initial velocity
    const timeToTarget = 1.5; // Time to reach target
    const gravity = this._physics.gravity * 9.8;
    
    // Calculate required initial velocity for parabolic trajectory
    const initialVelocityX = dx / timeToTarget;
    const initialVelocityY = (dy - 0.5 * gravity * timeToTarget * timeToTarget) / timeToTarget;
    
    let initialVelocity = {
      x: initialVelocityX,
      y: initialVelocityY
    };
    
    // Ensure minimum upward velocity to prevent downward start
    if (initialVelocity.y < 2) {
      initialVelocity.y = 2;
    }
    
    // Adjust for different throw types with enhanced physics
    switch (type) {
      case 'arc':
        // Higher arc with more dramatic curve
        initialVelocity.y *= 1.8;
        initialVelocity.x *= 0.9;
        break;
      case 'parabola':
        // Natural parabola - ensure upward start
        if (initialVelocity.y < 3) {
          initialVelocity.y = 3;
        }
        break;
      case 'straight':
        // More direct path with less arc
        initialVelocity.y *= 0.6;
        initialVelocity.x *= 1.4;
        break;
      case 'bounce':
        // Bouncy path with multiple bounces
        this.updatePhysics({ bounce: 0.9, friction: 0.05 });
        initialVelocity.y *= 0.8;
        break;
      case 'spiral':
        // Spiral path with rotation
        initialVelocity.y *= 0.9;
        initialVelocity.x *= 1.2;
        break;
    }
    
    // Simulate the path with physics
    this.reset({ x: startX, y: startY }, initialVelocity);
    
    for (let i = 0; i < steps; i++) {
      const time = i * 0.016; // 60fps simulation
      const result = this.update(time * 1000);
      
      path.push({
        x: result.x,
        y: result.y,
        velocity: { ...this._velocity }
      });
      
      // Stop if we've hit the ground and stopped bouncing
      if (result.grounded && Math.abs(this._velocity.y) < 0.1 && Math.abs(this._velocity.x) < 0.1) {
        break;
      }
    }
    
    return path;
  }

  /**
   * Create a smooth animation curve with advanced easing
   */
  createSmoothCurve(
    start: number,
    end: number,
    duration: number,
    easing: 'smooth' | 'elastic' | 'bounce' | 'natural' | 'overshoot' = 'natural'
  ): number[] {
    const steps = Math.ceil(duration * 60); // 60fps
    const curve: number[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const easedT = SwipeyPhysicsEngine.easingFunctions[easing](t);
      const value = start + (end - start) * easedT;
      curve.push(value);
    }
    
    return curve;
  }

  /**
   * Calculate squash and stretch effect based on velocity
   */
  calculateSquashAndStretch(velocity: { x: number, y: number }): { scaleX: number, scaleY: number } {
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    const maxSpeed = 10;
    const normalizedSpeed = Math.min(speed / maxSpeed, 1);
    
    // Squash when moving fast, stretch when accelerating
    const squashFactor = 1 - normalizedSpeed * 0.3;
    const stretchFactor = 1 + normalizedSpeed * 0.2;
    
    return {
      scaleX: stretchFactor,
      scaleY: squashFactor
    };
  }
}

/**
 * Enhanced bezier curve creation with physics integration
 */
export function createPhysicsBezier(
  points: { x: number, y: number }[],
  physics: PhysicsProps,
  steps: number = 100
): { x: number, y: number }[] {
  if (points.length < 2) return points;
  
  const path: { x: number, y: number }[] = [];
  const engine = new SwipeyPhysicsEngine(physics);
  
  // Create smooth bezier curve with physics influence
  const bezierPoint = (t: number): { x: number, y: number } => {
    if (points.length === 2) {
      // Linear interpolation for 2 points
      return {
        x: points[0].x + (points[1].x - points[0].x) * t,
        y: points[0].y + (points[1].y - points[0].y) * t
      };
    }
    
    // Quadratic bezier for 3 points
    if (points.length === 3) {
      const x = Math.pow(1 - t, 2) * points[0].x + 
                2 * (1 - t) * t * points[1].x + 
                Math.pow(t, 2) * points[2].x;
      const y = Math.pow(1 - t, 2) * points[0].y + 
                2 * (1 - t) * t * points[1].y + 
                Math.pow(t, 2) * points[2].y;
      return { x, y };
    }
    
    // Cubic bezier for 4+ points
    const n = points.length - 1;
    let x = 0, y = 0;
    
    for (let i = 0; i <= n; i++) {
      const coefficient = binomial(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
      x += coefficient * points[i].x;
      y += coefficient * points[i].y;
    }
    
    return { x, y };
  };
  
  // Generate path with physics-based smoothing
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const point = bezierPoint(t);
    
    // Apply physics-based smoothing
    if (i > 0 && i < steps) {
      const prevPoint = path[path.length - 1];
      const velocity = {
        x: point.x - prevPoint.x,
        y: point.y - prevPoint.y
      };
      
      // Apply drag and turbulence
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      if (speed > 0) {
        const dragFactor = 1 - (physics.drag || 0.15) * 0.1;
        point.x = prevPoint.x + velocity.x * dragFactor;
        point.y = prevPoint.y + velocity.y * dragFactor;
      }
    }
    
    path.push(point);
  }
  
  return path;
}

// Helper function for binomial coefficient
function binomial(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i) / (i + 1);
  }
  return result;
}

/**
 * FlashterFX Physics Engine
 * 
 * Provides physics calculations for stage layers and animations.
 * Handles velocity, acceleration, friction, and basic collision detection.
 */

export interface PhysicsState {
  velocity: { x: number, y: number };
  acceleration: { x: number, y: number };
  angularVelocity: number;
  mass: number;
  friction: number;
  elasticity: number;
  fixed: boolean;
}

/**
 * Apply physics calculations to update the state
 * @param state Current physics state
 * @param deltaTime Time elapsed since last update (in seconds)
 * @returns Updated physics state
 */
export function applyPhysics(state: PhysicsState, deltaTime: number): PhysicsState {
  // Clone state to avoid mutation
  const newState = { ...state };
  
  // Apply acceleration to velocity
  newState.velocity.x += state.acceleration.x * deltaTime;
  newState.velocity.y += state.acceleration.y * deltaTime;
  
  // Apply friction
  newState.velocity.x *= (1 - state.friction * deltaTime);
  newState.velocity.y *= (1 - state.friction * deltaTime);
  
  // Small velocities can be zeroed out
  if (Math.abs(newState.velocity.x) < 0.001) newState.velocity.x = 0;
  if (Math.abs(newState.velocity.y) < 0.001) newState.velocity.y = 0;
  
  // Apply angular velocity
  if (newState.angularVelocity) {
    newState.angularVelocity *= (1 - state.friction * deltaTime);
    if (Math.abs(newState.angularVelocity) < 0.001) newState.angularVelocity = 0;
  }
  
  return newState;
}

/**
 * Apply an impulse to an object
 * @param state Current physics state
 * @param impulseX X-component of the impulse
 * @param impulseY Y-component of the impulse
 * @returns Updated physics state with new velocity
 */
export function applyImpulse(state: PhysicsState, impulseX: number, impulseY: number): PhysicsState {
  // Apply an impulse based on mass
  const newState = { ...state };
  newState.velocity.x += impulseX / state.mass;
  newState.velocity.y += impulseY / state.mass;
  return newState;
}

/**
 * Calculate the physics update for a collision between two objects
 * @param a First object's physics state
 * @param b Second object's physics state
 * @returns Array containing updated physics states for both objects
 */
export function calculateCollision(a: PhysicsState, b: PhysicsState): [PhysicsState, PhysicsState] {
  // Basic elastic collision implementation
  const newA = { ...a };
  const newB = { ...b };
  
  // Calculate collision dynamics only for non-fixed objects
  if (!a.fixed && !b.fixed) {
    // Conservation of momentum calculation
    const totalMass = a.mass + b.mass;
    const aRatio = a.mass / totalMass;
    const bRatio = b.mass / totalMass;
    
    // Calculate new velocities (simplified model)
    const tempVelocityAX = newA.velocity.x;
    const tempVelocityAY = newA.velocity.y;
    
    newA.velocity.x = aRatio * newA.velocity.x + bRatio * newB.velocity.x * (1 + a.elasticity);
    newA.velocity.y = aRatio * newA.velocity.y + bRatio * newB.velocity.y * (1 + a.elasticity);
    
    newB.velocity.x = bRatio * newB.velocity.x + aRatio * tempVelocityAX * (1 + b.elasticity);
    newB.velocity.y = bRatio * newB.velocity.y + aRatio * tempVelocityAY * (1 + b.elasticity);
  } else if (a.fixed && !b.fixed) {
    // If a is fixed, only b's velocity changes
    newB.velocity.x = -newB.velocity.x * b.elasticity;
    newB.velocity.y = -newB.velocity.y * b.elasticity;
  } else if (!a.fixed && b.fixed) {
    // If b is fixed, only a's velocity changes
    newA.velocity.x = -newA.velocity.x * a.elasticity;
    newA.velocity.y = -newA.velocity.y * a.elasticity;
  }
  
  return [newA, newB];
}

/**
 * Create default physics state
 * @returns Default physics state object
 */
export function createDefaultPhysicsState(): PhysicsState {
  return {
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    angularVelocity: 0,
    mass: 1,
    friction: 0.1,
    elasticity: 0.8,
    fixed: false
  };
} 