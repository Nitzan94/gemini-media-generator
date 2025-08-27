// Sound effects and haptic feedback utilities for creative actions

class CreativeSounds {
  private audioContext: AudioContext | null = null;
  
  constructor() {
    // Initialize audio context only when needed to avoid autoplay policy issues
    this.initializeAudio();
  }

  private initializeAudio() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      // Initialize on user interaction to comply with browser autoplay policies
      const initAudio = () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
          document.removeEventListener('click', initAudio);
          document.removeEventListener('keydown', initAudio);
        }
      };
      
      document.addEventListener('click', initAudio, { once: true });
      document.addEventListener('keydown', initAudio, { once: true });
    }
  }

  // Create a simple tone
  private createTone(frequency: number, duration: number, volume: number = 0.1): void {
    if (!this.audioContext || this.audioContext.state === 'suspended') {
      return;
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch {
      console.log('Audio playback not available');
    }
  }

  // Haptic feedback
  private vibrate(pattern: number | number[]): void {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        console.log('Haptic feedback not available');
      }
    }
  }

  // Sound effects for different actions
  playUploadSound(): void {
    this.createTone(440, 0.15, 0.05); // A4 note
    this.vibrate(50); // Short vibration
  }

  playGenerateStartSound(): void {
    // Rising tone sequence
    setTimeout(() => this.createTone(330, 0.1, 0.04), 0);   // E4
    setTimeout(() => this.createTone(392, 0.1, 0.04), 100); // G4  
    setTimeout(() => this.createTone(523, 0.2, 0.05), 200); // C5
    this.vibrate([100, 50, 100]); // Pattern vibration
  }

  playSuccessSound(): void {
    // Success chord progression
    setTimeout(() => this.createTone(523, 0.15, 0.06), 0);   // C5
    setTimeout(() => this.createTone(659, 0.15, 0.06), 50);  // E5
    setTimeout(() => this.createTone(784, 0.3, 0.07), 100);  // G5
    this.vibrate([80, 30, 120]); // Success pattern
  }

  playCopySound(): void {
    this.createTone(660, 0.1, 0.04); // E5 note - quick and light
    this.vibrate(30); // Very short vibration
  }

  playHoverSound(): void {
    this.createTone(880, 0.05, 0.02); // A5 note - very subtle
    // No vibration for hover - too frequent
  }

  playClickSound(): void {
    this.createTone(1047, 0.08, 0.03); // C6 note - crisp click
    this.vibrate(20); // Very short tap
  }

  playMagicSparkleSound(): void {
    // Magical sparkle sequence
    const notes = [1175, 1397, 1661, 1976]; // D6, F6, Ab6, B6
    notes.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.12, 0.03), index * 80);
    });
    this.vibrate([25, 25, 25, 25, 50]); // Sparkle pattern
  }

  playErrorSound(): void {
    // Low, descending tone
    setTimeout(() => this.createTone(220, 0.2, 0.05), 0);   // A3
    setTimeout(() => this.createTone(196, 0.3, 0.04), 150); // G3
    this.vibrate([200, 100, 200]); // Error pattern
  }

  // Enable/disable sound system
  setEnabled(enabled: boolean): void {
    if (!enabled && this.audioContext) {
      this.audioContext.suspend();
    } else if (enabled && this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Create singleton instance
export const creativeSounds = new CreativeSounds();

// Helper functions for easy use in components
export const playUploadSound = () => creativeSounds.playUploadSound();
export const playGenerateStartSound = () => creativeSounds.playGenerateStartSound();
export const playSuccessSound = () => creativeSounds.playSuccessSound();
export const playCopySound = () => creativeSounds.playCopySound();
export const playHoverSound = () => creativeSounds.playHoverSound();
export const playClickSound = () => creativeSounds.playClickSound();
export const playMagicSparkleSound = () => creativeSounds.playMagicSparkleSound();
export const playErrorSound = () => creativeSounds.playErrorSound();
export const setSoundsEnabled = (enabled: boolean) => creativeSounds.setEnabled(enabled);