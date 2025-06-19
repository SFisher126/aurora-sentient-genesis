
interface GestureEvent {
  type: 'swipe' | 'pinch' | 'shake' | 'long-press';
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
  intensity?: number;
}

class GestureService {
  private touchStart: { x: number; y: number; time: number } | null = null;
  private listeners: ((gesture: GestureEvent) => void)[] = [];
  private shakeThreshold = 15;
  private lastShake = 0;
  private isEnabled = true;

  constructor() {
    this.initializeGestures();
  }

  private initializeGestures() {
    // Touch gestures
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    document.addEventListener('touchmove', this.handleTouchMove.bind(this));

    // Shake detection
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this));
    }

    // Pinch/zoom detection
    document.addEventListener('gesturestart', this.handleGestureStart.bind(this));
    document.addEventListener('gesturechange', this.handleGestureChange.bind(this));
  }

  private handleTouchStart(event: TouchEvent) {
    if (!this.isEnabled || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }

  private handleTouchEnd(event: TouchEvent) {
    if (!this.isEnabled || !this.touchStart || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStart.x;
    const deltaY = touch.clientY - this.touchStart.y;
    const deltaTime = Date.now() - this.touchStart.time;

    // Long press detection
    if (deltaTime > 800 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.emitGesture({ type: 'long-press' });
      return;
    }

    // Swipe detection
    if (deltaTime < 300) {
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > 50) {
        let direction: 'up' | 'down' | 'left' | 'right';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }

        this.emitGesture({ 
          type: 'swipe', 
          direction,
          intensity: Math.min(distance / 100, 3)
        });
      }
    }

    this.touchStart = null;
  }

  private handleTouchMove(event: TouchEvent) {
    // Предотвращаем случайные срабатывания
    if (event.touches.length > 1) {
      this.touchStart = null;
    }
  }

  private handleDeviceMotion(event: DeviceMotionEvent) {
    if (!this.isEnabled) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x = 0, y = 0, z = 0 } = acceleration;
    const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z);

    if (accelerationMagnitude > this.shakeThreshold) {
      const now = Date.now();
      if (now - this.lastShake > 1000) { // Prevent rapid fire
        this.lastShake = now;
        this.emitGesture({ 
          type: 'shake', 
          intensity: Math.min(accelerationMagnitude / 20, 3)
        });
      }
    }
  }

  private handleGestureStart(event: any) {
    event.preventDefault();
  }

  private handleGestureChange(event: any) {
    if (!this.isEnabled) return;
    
    event.preventDefault();
    this.emitGesture({ 
      type: 'pinch', 
      scale: event.scale 
    });
  }

  private emitGesture(gesture: GestureEvent) {
    console.log('👋 Gesture detected:', gesture);
    this.listeners.forEach(listener => listener(gesture));
  }

  onGesture(callback: (gesture: GestureEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isGestureEnabled(): boolean {
    return this.isEnabled;
  }
}

export const gestureService = new GestureService();
