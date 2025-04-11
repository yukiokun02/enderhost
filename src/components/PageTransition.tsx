
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading for smoother transitions
  useEffect(() => {
    setIsLoading(true);
    
    // Minimum loading time to show animation (600-1400ms)
    const minLoadTime = Math.random() * 800 + 600;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadTime);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.4,
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingIndicator />}
      </AnimatePresence>
      
      <motion.div
        initial="initial"
        animate={isLoading ? "initial" : "in"}
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;
