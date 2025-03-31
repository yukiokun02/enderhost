
import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const threshold = 10;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - prevScrollY) < threshold) {
        ticking = false;
        return;
      }

      // When at the top of the page, always show the navbar
      if (scrollY < 50) {
        setVisible(true);
        setPrevScrollY(scrollY);
        ticking = false;
        return;
      }

      const newScrollDirection = scrollY > prevScrollY ? 'down' : 'up';
      
      if (newScrollDirection !== scrollDirection) {
        setScrollDirection(newScrollDirection);
        setVisible(newScrollDirection === 'up');
      }
      
      setPrevScrollY(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDirection, prevScrollY]);

  return { visible, scrollDirection };
};
