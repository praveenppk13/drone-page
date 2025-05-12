import React, { useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, PerformanceMonitor } from '@react-three/drei';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import DroneModel from './DroneModel';
import { TextGenerateEffect } from './ui/text-generate-effect';

gsap.registerPlugin(TextPlugin);

const Hero = ({ scrollYProgress, mouseX, mouseY, negMouseX, negMouseY }) => {
  const parallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    gsap.fromTo(
      '.cta-button',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1 }
    );
    gsap.fromTo(
      '.hero-canvas',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  return (
    <motion.section
      id="home"
      className="min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] flex items-center justify-center shared-bg relative"
      style={{ backgroundPositionY: parallax }}
      aria-labelledby="hero-heading"
    >
      {/* Particle Background */}
      <div className="particle-bg">
        <div className="gradient-layer" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
        <div className="pulse-1" />
        <div className="pulse-2" />
      </div>

      <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
        {/* Text Content */}
        <motion.div
          className="hero-text w-full md:w-1/2 text-center md:text-left"
          style={{ x: mouseX, y: mouseY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <TextGenerateEffect
            words="SkyMaster Pro"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-cyan-300 font-orbitron"
            duration={1.2}
            nowrap={true}
          />
          <TextGenerateEffect
            words="Unleash your creativity with the next-gen drone, engineered for professionals and adventurers."
            className="text-base sm:text-lg mb-6 text-gray-200 font-semibold font-orbitron"
            duration={1.0}
            delay={0.4}
          />
          <motion.a
            href="#contact"
            className="cta-button inline-block bg-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-cyan-600 transition transform hover:scale-105 ring-2 ring-cyan-400/50 font-orbitron"
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            Discover Now
          </motion.a>
        </motion.div>
        {/* 3D Canvas */}
        <motion.div
          className="hero-canvas w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px]"
          style={{ x: negMouseX, y: negMouseY }}
        >
          <Canvas
            camera={{ position: [0, 0, window.innerWidth <= 320 ? 7 : window.innerWidth < 768 ? 6 : 5], fov: window.innerWidth <= 320 ? 70 : window.innerWidth < 768 ? 60 : 50 }}
            shadows={window.innerWidth >= 768}
            gl={{ antialias: window.innerWidth >= 768 }}
          >
            <PerformanceMonitor factor={window.innerWidth <= 320 ? 0.3 : window.innerWidth < 768 ? 0.5 : 1} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow={window.innerWidth >= 768} />
            <DroneModel 
              interactive={false} 
              scale={0.8} 
              propellerEmissive={0} 
              isHero={true}
            />
            <Environment preset="studio" />
          </Canvas>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-5 sm:bottom-10 left-[46%] transform -translate-x-1/2 flex flex-col items-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        role="button"
        aria-label="Scroll to begin"
      >
        <div className="w-4 sm:w-6 h-6 sm:h-8 border-2 border-cyan-400 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        </div>
        <motion.div
          className="text-[5px] xs:text-[5px] text-cyan-300 font-orbitron mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Scroll to Begin
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;