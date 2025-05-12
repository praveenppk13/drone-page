import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Mail, Plane } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const linkHoverVariants = {
    hover: {
      y: -3,
      scale: 1.05,
      textShadow: '0 0 8px rgba(6, 182, 212, 0.8)',
      transition: { duration: 0.3 },
    },
  };

  const iconHoverVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 },
    },
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      alert('Subscribed successfully!');
    }, 1000);
  };

  const companyLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#careers' },
    { name: 'Support', href: '#support' },
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/skymasterpro', icon: <Twitter className="w-6 h-6" /> },
    { name: 'Instagram', href: 'https://instagram.com/skymasterpro', icon: <Instagram className="w-6 h-6" /> },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/skymasterpro', icon: <Linkedin className="w-6 h-6" /> },
  ];

  return (
    <motion.footer
      id="contact"
      ref={ref}
      className="min-h-[60vh] py-12 sm:py-16 shared-bg relative"
      variants={flowContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-labelledby="footer-tagline"
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

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        {/* Tagline */}
        <motion.div
          className="text-center mb-12 footer-tagline-glow"
          variants={flowChildVariants}
        >
          <motion.h2
            id="footer-tagline"
            className="text-2xl sm:text-3xl font-bold text-cyan-300 font-orbitron"
            variants={headingVariants}
          >
            Innovate. Explore
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-gray-300 mt-2"
            variants={flowChildVariants}
          >
            Elevate your perspective with SkyMaster Pro.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Contact Info */}
          <motion.div variants={flowChildVariants} className="text-center">
            <h4 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-4 font-orbitron flex items-center justify-center">
              <motion.span variants={flowChildVariants}>
                <Plane className="w-7 h-7 mr-2 animate-neon-pulse" />
              </motion.span>
              Contact Us
            </h4>
            <motion.a
              href="mailto:info@skymasterpro.com"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm sm:text-base"
              variants={flowChildVariants}
              whileHover="hover"
            >
              <Mail className="w-5 h-5 mr-2" />
              info@skymasterpro.com
            </motion.a>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={flowChildVariants}>
            <h4 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-4 text-center font-orbitron">
              Explore
            </h4>
            <ul className="space-y-3 flex flex-col items-center">
              {companyLinks.map((link) => (
                <motion.li key={link.name} variants={flowChildVariants}>
                  <motion.a
                    href={link.href}
                    className="text-gray-300 hover:text-cyan-400 transition-colors text-sm sm:text-base"
                    variants={linkHoverVariants}
                    whileHover="hover"
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div variants={flowChildVariants}>
            <h4 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-4 text-center font-orbitron">
              Stay Connected
            </h4>
            <motion.div
              className="mb-6 max-w-xs mx-auto"
              variants={flowChildVariants}
            >
              <p className="text-sm sm:text-base text-gray-300 mb-3 text-center">
                Subscribe for updates and exclusive offers.
              </p>
              <motion.form
                onSubmit={handleSubscribe}
                className="flex max-w-xs mx-auto"
                variants={flowChildVariants}
              >
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-gray-900 bg-gray-100 rounded-l-full focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
                  disabled={isSubmitting}
                  aria-label="Email address for newsletter"
                  variants={flowChildVariants}
                />
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-gray-900 rounded-r-full font-semibold transition-colors hover:bg-cyan-400 disabled:opacity-50"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(6, 182, 212, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  variants={flowChildVariants}
                >
                  {isSubmitting ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    'Join'
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
            <motion.div
              className="flex justify-center space-x-6"
              variants={flowChildVariants}
            >
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                  variants={iconHoverVariants}
                  whileHover="hover"
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.hr
          className="my-8 border-gray-700/50"
          variants={flowChildVariants}
        />

        {/* Copyright */}
        <motion.div
          className="text-center text-xs sm:text-sm text-gray-400"
          variants={flowChildVariants}
        >
          © 2025 SkyMaster Pro. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default React.memo(Footer);