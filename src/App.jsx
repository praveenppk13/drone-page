import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useMotionValue, useTransform } from 'framer-motion';
import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Specs from './components/Customization';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';

const App = () => {
  const { scrollYProgress } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const negMouseX = useTransform(mouseX, (x) => -x);
  const negMouseY = useTransform(mouseY, (y) => -y);
  const homeRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans relative">
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div ref={homeRef}>
        <Hero
          scrollYProgress={scrollYProgress}
          mouseX={mouseX}
          mouseY={mouseY}
          negMouseX={negMouseX}
          negMouseY={negMouseY}
        />
      </div>
      <Features />
      <Specs />
      <Footer />
      <BackToTopButton homeRef={homeRef} />
    </div>
  );
};

export default App;