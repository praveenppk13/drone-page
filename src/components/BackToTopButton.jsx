import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      className={`
        fixed bottom-4 right-4
        w-6 h-10
        bg-gray-900/80 backdrop-blur-md
        border-2 border-cyan-400
        text-cyan-300
        flex items-center justify-center
        z-50
        font-orbitron
        transition-all duration-300
        hover:bg-cyan-400/20 hover:ring-2 hover:ring-cyan-400/50
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      style={{ borderRadius: '30px' }} // Vertical capsule shape
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </motion.button>
  );
};

export default BackToTopButton;