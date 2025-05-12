import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { Camera, Navigation, Battery } from 'lucide-react';

const Features = () => {
  const ref = useRef();
  const isInView = useInView(ref, { margin: '-150px', once: false });

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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        scale: { type: 'spring', stiffness: 200, damping: 20 },
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 140,
      },
    },
    hover: {
      scale: 1.2,
      transition: { duration: 0.3 },
    },
  };

  const features = [
    {
      title: '4K Ultra HD Camera',
      desc: 'Capture stunning visuals with unparalleled clarity and vibrant colors.',
      details: '8MP sensor, 120° FOV, and real-time HDR for cinematic footage.',
      icon: <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
    },
    {
      title: 'Advanced GPS Navigation',
      desc: 'Navigate effortlessly with intelligent GPS and auto return-to-home.',
      details: 'GLONASS support, 5m accuracy, and obstacle avoidance technology.',
      icon: <Navigation className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
    },
    {
      title: 'Long Battery Life',
      desc: 'Explore longer with up to 40 minutes of flight time.',
      details: '5000mAh battery with fast charging and power-saving modes.',
      icon: <Battery className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
    },
  ];

  const FeatureCard = ({ feature, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
    const isTouchDevice = 'ontouchstart' in window;
    const lastClick = useRef(0);

    const handleMouseMove = (e) => {
      if (isTouchDevice) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = (e.clientX - rect.left - centerX) / centerX;
      const mouseY = (e.clientY - rect.top - centerY) / centerY;
      x.set(mouseX);
      y.set(mouseY);
    };

    const handleMouseLeave = () => {
      if (isTouchDevice) return;
      x.set(0);
      y.set(0);
    };

    const handleClick = () => {
      const now = Date.now();
      if (now - lastClick.current < 300) return; // Debounce clicks (300ms)
      lastClick.current = now;
      setIsFlipped(!isFlipped);
      if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
      <motion.div
        ref={cardRef}
        className="relative bg-gray-800/20 backdrop-blur-2xl p-4 sm:p-5 md:p-5 lg:p-6 rounded-2xl border border-gray-700/20 shadow-xl group transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] min-h-[200px] sm:min-h-[220px] md:min-h-[220px] lg:min-h-[260px] w-full"
        variants={cardVariants}
        style={{ perspective: 1200 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={{ scale: isTouchDevice ? 1 : 1.05, translateZ: isTouchDevice ? 0 : 20 }}
        whileTap={{ scale: 0.95 }}
        whileFocus={{ scale: isTouchDevice ? 1 : 1.05, translateZ: isTouchDevice ? 0 : 20 }}
        tabIndex={0}
        role="article"
        aria-labelledby={`feature-title-${index}`}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          {/* Front Side */}
          <motion.div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden', rotateX, rotateY }}
          >
            <motion.div
              className="flex justify-center mb-4 sm:mb-5 md:mb-5 lg:mb-6 relative"
              variants={iconVariants}
              whileHover="hover"
            >
              <div className="absolute w-12 h-12 sm:w-14 sm:h-14 bg-cyan-400/40 rounded-full filter blur-xl animate-pulse group-hover:blur-2xl transition-all" />
              {feature.icon}
            </motion.div>
            <h3
              id={`feature-title-${index}`}
              className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold text-center text-white mb-3 sm:mb-3 md:mb-3 lg:mb-4 group-hover:text-cyan-300 transition-colors"
            >
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-sm lg:text-base text-center text-gray-200 line-clamp-3">
              {feature.desc}
            </p>
          </motion.div>
          {/* Back Side */}
          <motion.div
            className="absolute inset-0 backface-hidden bg-gray-800/30 backdrop-blur-2xl rounded-2xl flex flex-col items-center justify-center p-4 sm:p-5 md:p-5 lg:p-6"
            style={{ backfaceVisibility: 'hidden', rotateY: 180 }}
          >
            <h3
              className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold text-center text-cyan-300 mb-3 sm:mb-3 md:mb-3 lg:mb-4"
            >
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-sm lg:text-base text-center text-gray-200 line-clamp-3">
              {feature.details}
            </p>
          </motion.div>
        </motion.div>
        {/* Multi-Layered Neon Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/50 to-purple-400/50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 animate-neon-pulse pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/30 to-purple-400/30 opacity-0 group-hover:opacity-70 group-focus:opacity-70 transition-opacity duration-500 animate-neon-pulse-delayed pointer-events-none" />
        {/* Animated Gradient Border (Pseudo-element) */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl animate-border-flow border-2 border-transparent" style={{ borderImage: 'linear-gradient(to right, rgba(0, 255, 255, 0.5), rgba(192, 38, 211, 0.5)) 1' }} />
        </div>
        {/* Focus Ring */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-cyan-400/60 opacity-0 group-focus:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {/* Ripple Effect on Tap */}
        <div
          className="absolute inset-0 rounded-2xl bg-cyan-400/30 opacity-0 group-active:opacity-100 transition-opacity duration-300 animate-ripple pointer-events-none"
        />
      </motion.div>
    );
  };

  return (
    <motion.section
      id="features"
      ref={ref}
      className="min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] py-16 sm:py-24 shared-bg relative"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-labelledby="features-heading"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          id="features-heading"
          className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-center text-cyan-300 mb-10 sm:mb-10 md:mb-10 lg:mb-12 tracking-tight font-orbitron features-heading-glow"
          variants={headingVariants}
        >
          Next-Gen Features
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-5 lg:gap-6"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Tailwind Animation for Neon Pulse, Ripple, and Border Flow */}
      <style>{`
        @keyframes neon-pulse-delayed {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
        .animate-neon-pulse-delayed {
          animation: neon-pulse-delayed 1.5s ease-in-out infinite;
        }
        @keyframes border-flow {
          0% { border-image-source: linear-gradient(to right, rgba(0, 255, 255, 0.5), rgba(192, 38, 211, 0.5)); }
          50% { border-image-source: linear-gradient(to left, rgba(0, 255, 255, 0.5), rgba(192, 38, 211, 0.5)); }
          100% { border-image-source: linear-gradient(to right, rgba(0, 255, 255, 0.5), rgba(192, 38, 211, 0.5)); }
        }
        .animate-border-flow {
          animation: border-flow 3s ease infinite;
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </motion.section>
  );
};

export default Features;