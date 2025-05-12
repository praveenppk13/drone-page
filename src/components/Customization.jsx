import React, { useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { create } from 'zustand';
import DroneModel from './DroneModel';

const useCustomizationStore = create((set) => ({
  bodyColor: '#000000',
  propellerColor: '#000000',
  steelBodyColor: null,
  setBodyColor: (bodyColor) => set({ bodyColor }),
  setPropellerColor: (propellerColor) => set({ propellerColor }),
  setSteelBodyColor: (steelBodyColor) => set({ steelBodyColor }),
  reset: () => set({ bodyColor: '#000000', propellerColor: '#000000', steelBodyColor: null }),
}));

const ControlPanel = () => {
  const { bodyColor, propellerColor, steelBodyColor, setBodyColor, setPropellerColor, setSteelBodyColor, reset } = useCustomizationStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`
        fixed
        top-[64px] right-2
        sm:top-4 sm:right-4
        w-48
        sm:w-56
        h-auto
        max-h-[calc(100vh-64px)]
        overflow-y-auto
        bg-transparent
        backdrop-blur-sm
        rounded-xl
        z-[9999]
        font-orbitron
        text-gray-100
        transition-all
        duration-300
        ${isExpanded ? 'h-auto' : 'h-16'}
      `}
      role="region"
      aria-label="Drone Customization Controls"
    >
      <div className="w-full h-full bg-gray-900/40 rounded-xl shadow-2xl shadow-cyan-500/20 p-4 hover:shadow-cyan-500/40 transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[10px] sm:text-[12px] font-bold text-cyan-300 tracking-wide">Customize</h3>
          <button
            onClick={togglePanel}
            className="text-cyan-300 focus:outline-none text-xs sm:text-sm"
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            <div>
              <label htmlFor="bodyColor" className="block text-[10px] sm:text-[12px] font-medium text-gray-100 mb-1">
                Body Color
              </label>
              <input
                id="bodyColor"
                type="color"
                value={bodyColor || '#000000'}
                onChange={(e) => setBodyColor(e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full appearance-none cursor-pointer border-none shadow-[0_0_8px_rgba(0,255,255,0.5)] bg-black transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,255,255,0.8)]"
              />
            </div>
            <div>
              <label htmlFor="propellerColor" className="block text-[10px] sm:text-[12px] font-medium text-gray-100 mb-1">
                Propeller Color
              </label>
              <input
                id="propellerColor"
                type="color"
                value={propellerColor || '#000000'}
                onChange={(e) => setPropellerColor(e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full appearance-none cursor-pointer border-none shadow-[0_0_8px_rgba(0,255,255,0.5)] bg-black transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,255,255,0.8)]"
              />
            </div>
            <div>
              <label htmlFor="steelBodyColor" className="block text-[10px] sm:text-[12px] font-medium text-gray-100 mb-1">
                Steel Body Color
              </label>
              <input
                id="steelBodyColor"
                type="color"
                value={steelBodyColor || '#000000'}
                onChange={(e) => setSteelBodyColor(e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full appearance-none cursor-pointer border-none shadow-[0_0_8px_rgba(0,255,255,0.5)] bg-black transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,255,255,0.8)]"
              />
            </div>
            <button
              onClick={reset}
              className="w-full py-2 text-[10px] sm:text-[12px] bg-cyan-500 text-gray-900 rounded-md font-semibold tracking-wide transition-all duration-200 hover:bg-cyan-400"
              aria-label="Reset customization options to default"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Customization = ({ className = '' }) => {
  const ref = useRef();
  const isInView = useInView(ref, { margin: '-150px', once: false });
  const { bodyColor, propellerColor, steelBodyColor } = useCustomizationStore();

  const headingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const flowContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const flowChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.section
      id="build"
      ref={ref}
      className={`min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] py-16 shared-bg relative ${className}`}
      variants={flowContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-labelledby="customization-heading"
    >
      {/* Particle Background */}
      <div className="particle-bg">
        <div className="gradient-layer" />
        {[...Array(10)].map((_, i) => (
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

      <ControlPanel />
      {/* View AR Link */}
      <motion.a
        href="https://p.plugxr.com/mVA0U8P"
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed
          bottom-4 left-1/2 transform -translate-x-1/2
          sm:top-[80px] sm:right-4 sm:bottom-auto sm:left-auto sm:transform-none
          px-4 py-2
          bg-transparent border-2 border-cyan-400 text-cyan-300 rounded-full font-orbitron text-[10px] font-semibold tracking-wide transition-all duration-300 hover:bg-cyan-400/20 hover:ring-2 hover:ring-cyan-400/50 z-[9998]
        "
        aria-label="View in Augmented Reality"
        role="link"
        variants={flowChildVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        View AR
      </motion.a>
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <motion.h2
          id="customization-heading"
          className="text-4xl font-extrabold text-center text-cyan-300 mb-12 font-orbitron customization-heading-glow"
          variants={headingVariants}
        >
          Customize Your Drone
        </motion.h2>
        <motion.div
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center mx-auto"
          variants={flowChildVariants}
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="w-full">
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <DroneModel 
              interactive 
              color={bodyColor} 
              propellerColor={propellerColor} 
              steelBodyColor={steelBodyColor}
              scale={0.8} 
              isHero={false} 
            />
            <Environment preset="studio" />
            <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={12} />
          </Canvas>
        </motion.div>
      </div>
    </motion.section>
  );
};

Customization.propTypes = {
  className: PropTypes.string,
};

export default memo(Customization);