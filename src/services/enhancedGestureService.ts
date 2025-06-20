
interface GestureEvent {
  type: 'swipe' | 'pinch' | 'shake' | 'longpress' | 'double-tap';
  direction?: 'up' | 'down' | 'left' | 'right';
  intensity?: number;
  target?: HTMLElement;
}

class EnhancedGestureService {
  private isEnabled = true;
  private listeners: Map<string, Function[]> = new Map();
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private lastTap = 0;
  private shakeThreshold = 15;
  private lastShake = 0;

  constructor() {
    this.initializeGestureListeners();
    this.initializeDeviceMotion();
  }

  private initializeGestureListeners() {
    // Touch events for swipes and taps
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });

    // Mouse events for desktop
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private initializeDeviceMotion() {
    if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this));
    }
  }

  private handleTouchStart(event: TouchEvent) {
    if (!this.isEnabled) return;

    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();

    // Проверяем долгое нажатие
    setTimeout(() => {
      if (this.touchStartTime && Date.now() - this.touchStartTime >= 1000) {
        this.triggerGesture({
          type: 'longpress',
          target: event.target as HTMLElement
        });
      }
    }, 1000);
  }

  private handleTouchEnd(event: TouchEvent) {
    if (!this.isEnabled) return;

    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - this.touchStartX;
    const deltaY = endY - this.touchStartY;
    const deltaTime = endTime - this.touchStartTime;

    // Свайпы
    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
      if (deltaTime < 300) {
        let direction: 'up' | 'down' | 'left' | 'right';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }

        this.triggerGesture({
          type: 'swipe',
          direction,
          intensity: Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        });
      }
    }

    // Двойное нажатие
    if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const now = Date.now();
      if (now - this.lastTap < 300) {
        this.triggerGesture({
          type: 'double-tap',
          target: event.target as HTMLElement
        });
      }
      this.lastTap = now;
    }

    this.touchStartTime = 0;
  }

  private handleTouchMove(event: TouchEvent) {
    // Предотвращаем скролл при свайпах
    if (event.touches.length === 1) {
      const deltaX = Math.abs(event.touches[0].clientX - this.touchStartX);
      const deltaY = Math.abs(event.touches[0].clientY - this.touchStartY);
      
      if (deltaX > 10 || deltaY > 10) {
        event.preventDefault();
      }
    }
  }

  private handleMouseDown(event: MouseEvent) {
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
    this.touchStartTime = Date.now();
  }

  private handleMouseUp(event: MouseEvent) {
    const endX = event.clientX;
    const endY = event.clientY;
    const endTime = Date.now();

    const deltaX = endX - this.touchStartX;
    const deltaY = endY - this.touchStartY;
    const deltaTime = endTime - this.touchStartTime;

    if (deltaTime >= 1000 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.triggerGesture({
        type: 'longpress',
        target: event.target as HTMLElement
      });
    }
  }

  private handleDeviceMotion(event: DeviceMotionEvent) {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    const acceleration_magnitude = Math.sqrt(x*x + y*y + z*z);

    if (acceleration_magnitude > this.shakeThreshold) {
      const now = Date.now();
      if (now - this.lastShake > 1000) { // Минимум 1 секунда между встряхиваниями
        this.triggerGesture({
          type: 'shake',
          intensity: acceleration_magnitude
        });
        this.lastShake = now;
      }
    }
  }

  private triggerGesture(gesture: GestureEvent) {
    console.log(`👋 Жест: ${gesture.type}`, gesture);
    
    const listeners = this.listeners.get(gesture.type) || [];
    listeners.forEach(listener => listener(gesture));

    // Встроенные действия
    this.handleBuiltInGestures(gesture);
  }

  private handleBuiltInGestures(gesture: GestureEvent) {
    switch (gesture.type) {
      case 'swipe':
        if (gesture.direction === 'left') {
          this.triggerAction('navigate-back');
        } else if (gesture.direction === 'right') {
          this.triggerAction('navigate-forward');
        } else if (gesture.direction === 'up') {
          this.triggerAction('scroll-to-top');
        } else if (gesture.direction === 'down') {
          this.triggerAction('refresh');
        }
        break;

      case 'shake':
        this.triggerAction('random-theme');
        break;

      case 'double-tap':
        this.triggerAction('toggle-fullscreen');
        break;

      case 'longpress':
        this.triggerAction('show-context-menu');
        break;
    }
  }

  private triggerAction(action: string) {
    switch (action) {
      case 'navigate-back':
        window.history.back();
        break;

      case 'navigate-forward':
        window.history.forward();
        break;

      case 'scroll-to-top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'refresh':
        window.location.reload();
        break;

      case 'random-theme':
        // Интеграция с сервисом тем
        const themes = ['midnight-purple', 'rose-gold', 'ocean-depth', 'forest-green'];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        this.triggerGesture({ type: 'longpress' }); // Уведомляем о смене темы
        break;

      case 'toggle-fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
    }
  }

  onGesture(type: string, listener: Function) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(listener);
  }

  removeGestureListener(type: string, listener: Function) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    console.log(`👋 Жесты ${enabled ? 'включены' : 'отключены'}`);
  }

  isGestureEnabled(): boolean {
    return this.isEnabled;
  }
}

export const enhancedGestureService = new EnhancedGestureService();
