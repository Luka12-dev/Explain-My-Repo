import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/themeStore';

interface LiquidBackgroundProps {
  variant?: 'subtle' | 'normal' | 'intense';
}

const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ variant = 'normal' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useThemeStore();
  const isDark = theme === 'liquid-dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const blobs: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      hue: number;
    }> = [];

    const blobCount = variant === 'subtle' ? 3 : variant === 'intense' ? 7 : 5;

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 150,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 60 + (isDark ? 200 : 200),
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (isDark) {
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#0a0a0a');
      } else {
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f5f8ff');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      blobs.forEach((blob, index) => {
        blob.x += blob.speedX + Math.sin(time + index) * 0.3;
        blob.y += blob.speedY + Math.cos(time + index) * 0.3;

        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;

        const blobGradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );

        if (isDark) {
          blobGradient.addColorStop(0, `rgba(42, 42, 42, ${variant === 'subtle' ? 0.3 : variant === 'intense' ? 0.6 : 0.4})`);
          blobGradient.addColorStop(0.5, `rgba(26, 26, 26, ${variant === 'subtle' ? 0.2 : variant === 'intense' ? 0.4 : 0.3})`);
          blobGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          const lightness = 60 + Math.sin(time + index) * 10;
          blobGradient.addColorStop(0, `hsla(${blob.hue}, 100%, ${lightness}%, ${variant === 'subtle' ? 0.3 : variant === 'intense' ? 0.6 : 0.4})`);
          blobGradient.addColorStop(0.5, `hsla(${blob.hue}, 100%, ${lightness + 10}%, ${variant === 'subtle' ? 0.2 : variant === 'intense' ? 0.4 : 0.3})`);
          blobGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = blobGradient;
        ctx.filter = 'blur(40px)';
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

export default LiquidBackground;
