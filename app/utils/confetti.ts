import confetti from 'canvas-confetti';

// Success celebration with gentle confetti
export const triggerSuccessConfetti = () => {
  const colors = ['#3b82f6', '#10b981', '#fb923c', '#8b5cf6', '#fef08a'];
  
  // First burst - from center
  confetti({
    particleCount: 30,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
    gravity: 0.9,
    drift: 0,
    ticks: 300,
    scalar: 0.8,
    shapes: ['circle', 'square'],
  });

  // Second burst - from left
  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { x: 0.2, y: 0.7 },
      colors: colors,
      gravity: 0.8,
      drift: 0.2,
      ticks: 250,
      scalar: 0.7,
    });
  }, 250);

  // Third burst - from right
  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { x: 0.8, y: 0.7 },
      colors: colors,
      gravity: 0.8,
      drift: -0.2,
      ticks: 250,
      scalar: 0.7,
    });
  }, 500);
};

// Gentle celebration for small wins (like copying text)
export const triggerGentleConfetti = () => {
  const colors = ['#10b981', '#34d399'];
  
  confetti({
    particleCount: 15,
    spread: 30,
    origin: { y: 0.7 },
    colors: colors,
    gravity: 0.6,
    ticks: 200,
    scalar: 0.6,
    shapes: ['circle'],
  });
};

// Magic sparkles for generation start
export const triggerMagicSparkles = () => {
  const colors = ['#3b82f6', '#60a5fa', '#93c5fd'];
  
  // Sparkles from multiple points
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 8,
        spread: 35,
        origin: { 
          x: 0.3 + (i * 0.2), 
          y: 0.6 
        },
        colors: colors,
        gravity: 0.4,
        ticks: 150,
        scalar: 0.5,
        shapes: ['star', 'circle'],
      });
    }, i * 200);
  }
};