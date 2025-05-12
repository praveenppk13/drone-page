import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  // Animation variants for the logo letters
  const logoVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.06,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // Animation variants for nav items
  const navVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        staggerChildren: 0.15,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  // Hover animation for nav items
  const navHoverVariants = {
    initial: { y: 0, scale: 1 },
    hover: {
      y: -5,
      scale: 1.05,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 },
    },
  };

  // Animation for mobile menu container
  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55],
      },
    },
    exit: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
  };

  // Reset isMenuOpen on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMenuOpen]);

  // Menu items data
  const menuItems = ['Home', 'Features', 'Build', 'Contact'];

  // Split logo text into individual letters
  const logoText = 'DRONE'.split('');

  return (
    <motion.header
      initial={{ y: -100, opacity: 0, scale: 0.95, backdropFilter: 'blur(0px)' }}
      animate={{ y: 0, opacity: 1, scale: 1, backdropFilter: 'blur(8px)' }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
        <motion.div
          className="text-2xl font-extrabold text-cyan-400 flex font-orbitron"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.05,
            textShadow: '0 0 12px rgba(6, 182, 212, 0.9)',
            transition: { duration: 0.9, type: 'spring', stiffness: 200 },
          }}
        >
          {logoText.map((letter, index) => (
            <motion.span key={index} variants={letterVariants}>
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.div>
        <div
          className="hamburger md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <motion.span
            animate={
              isMenuOpen
                ? { rotate: 45, y: 6, background: '#06b6d4' }
                : { rotate: 0, y: 0, background: '#06b6d4' }
            }
            transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
          />
          <motion.span
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            animate={
              isMenuOpen
                ? { rotate: -45, y: -6, background: '#06b6d4' }
                : { rotate: 0, y: 0, background: '#06b6d4' }
            }
            transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
          />
        </div>
        <AnimatePresence>
          <motion.ul
            className={`nav-menu ${isMenuOpen ? 'flex flex-col items-center space-y-4 absolute top-full left-0 w-full bg-gray-900/95 py-4 md:hidden' : 'hidden md:flex md:space-x-6 md:static md:bg-transparent md:py-0'}`}
            variants={navVariants}
            initial="hidden"
            animate="visible"
            key="nav-menu"
          >
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                variants={navItemVariants}
                className="relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-base md:text-base lg:text-lg relative font-semibold font-orbitron"
                  variants={navHoverVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-white opacity-30"
                    initial={{ width: 0, x: 0 }}
                    whileHover={{ width: '30%', x: '70%', opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                  <motion.span
                    className="absolute -inset-1 pointer-events-none"
                    initial={{ textShadow: '0 0 0 rgba(6, 182, 212, 0)' }}
                    whileHover={{
                      textShadow: [
                        '0 0 5px rgba(6, 182, 212, 0.8)',
                        '0 0 10px rgba(6, 182, 212, 0.9)',
                        '0 0 5px rgba(6, 182, 212, 0.8)',
                      ],
                      transition: {
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'loop',
                      },
                    }}
                  />
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;