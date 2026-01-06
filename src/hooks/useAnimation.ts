import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export function useAnimation(duration: number = 300) {
  const { animations } = useSettingsStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    if (!animations) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  };

  return { isAnimating, startAnimation, animationsEnabled: animations };
}
