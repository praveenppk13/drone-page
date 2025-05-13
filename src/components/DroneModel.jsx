import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

const DroneModel = ({ 
  interactive = false, 
  color, 
  propellerColor,
  steelBodyColor,
  scale = 1, 
  isHero = false 
}) => {
  const { scene } = useGLTF('/models/drone.glb');
  const modelRef = useRef();
  const rotationSpeed = 0.075;
  const { size } = useThree();
  const hasLogged = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // Determine the appropriate scale based on screen width
  const responsiveScale = useMemo(() => {
    // Apply larger scale on mobile devices
    if (window.innerWidth < 768) {
      return isHero ? scale * 1.3 : scale * 1.2;
    }
    return scale;
  }, [scale, isHero]);

  // Clone the scene to avoid conflicts between canvases
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.originalColor = child.material.color.clone();
        if (!isHero && (
          child.name === 'Object_150' || 
          child.name === 'Object_50' || 
          child.name === 'Object_163' || 
          child.name === 'Object_18' || 
          child.name === 'Object_46'
        )) {
          child.material = new THREE.MeshBasicMaterial({
            color: child.material.color
          });
        }
      }
    });
    return clone;
  }, [scene, isHero]);

  // Set model as loaded after cloning
  useEffect(() => {
    setIsLoaded(true);
  }, [clonedScene]);

  // Log mesh names once for debugging
  useEffect(() => {
    if (!hasLogged.current) {
      console.log('Drone Model Mesh Names:');
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          console.log(`- ${child.name || 'Unnamed Mesh'}`);
        }
      });
      hasLogged.current = true;
    }
  }, [clonedScene]);

  // Apply customization only for non-hero sections
  useEffect(() => {
    if (!isLoaded) return;
    
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (!isHero) {
          if (child.name === 'Object_150' || child.name === 'Object_50') {
            const targetColor = new THREE.Color(color || child.originalColor);
            child.material.color.set(targetColor);
            child.material.needsUpdate = true;
          }
          if (child.name === 'Object_163') {
            const targetPropellerColor = new THREE.Color(propellerColor || child.originalColor);
            child.material.color.set(targetPropellerColor);
            child.material.needsUpdate = true;
          }
          if (child.name === 'Object_18' || child.name === 'Object_46') {
            const targetSteelBodyColor = new THREE.Color(steelBodyColor || child.originalColor);
            child.material.color.set(targetSteelBodyColor);
            child.material.needsUpdate = true;
          }
        } else {
          if (child.originalColor) {
            child.material.color.set(child.originalColor);
            child.material.needsUpdate = true;
          }
        }
      }
    });
    
    // Use responsive scale instead of fixed scale
    clonedScene.scale.set(responsiveScale, responsiveScale, responsiveScale);
  }, [clonedScene, color, propellerColor, steelBodyColor, responsiveScale, isHero, isLoaded]);

  // Set initial position and run animations
  useEffect(() => {
    if (!modelRef.current || !isLoaded) return;
    
    // Disable canvas touch actions (fixed from broken code)
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.touchAction = 'none';
    }
    
    if (isHero) {
      // Set consistent initial positions for hero mode
      modelRef.current.position.set(0, 0, 0);
      modelRef.current.rotation.set(0, 0, 0);
      modelRef.current.visible = true;
      
      // For hero, use a simplified animation that won't conflict with scrolling
      const heroTimeline = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.out' },
        onComplete: () => setIsAnimationComplete(true)
      });
      
      // Start with proper scale from the beginning to avoid jumping
      modelRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale);
      
      // Gentle floating animation
      heroTimeline.to(modelRef.current.position, {
        y: '+=0.2',
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut'
      });
    } 
    else if (interactive) {
      // Interactive mode for non-hero sections
      modelRef.current.position.set(0, -5, 8);
      modelRef.current.rotation.set(Math.PI / 6, Math.PI / 4, 0);
      modelRef.current.scale.set(0.2, 0.2, 0.2);
      
      const timeline = gsap.timeline({
        defaults: { ease: 'elastic.out(1, 0.75)', duration: 2 },
        onComplete: () => setIsAnimationComplete(true)
      });
      
      timeline
        .to(modelRef.current.position, {
          y: 0,
          z: 0,
          duration: 2.2,
          ease: 'power4.out'
        }, 0)
        .to(modelRef.current.rotation, {
          x: 0,
          y: 0,
          duration: 2.5,
          ease: 'elastic.out(1, 0.5)'
        }, 0.1)
        .to(modelRef.current.scale, {
          x: responsiveScale,
          y: responsiveScale,
          z: responsiveScale,
          duration: 2,
          ease: 'elastic.out(1, 0.8)'
        }, 0.2)
        .to(modelRef.current.position, {
          y: '+=0.1',
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: 'sine.inOut'
        }, '+=0.5');
    } 
    else {
      // Regular mode
      modelRef.current.position.set(0, 0, 0);
      modelRef.current.rotation.set(0, 0, 0);
      modelRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale);
      setIsAnimationComplete(true);
    }
  }, [interactive, responsiveScale, isHero, isLoaded]);

  // Auto-rotation and bobbing
  useFrame((state, delta) => {
    if (!modelRef.current || !isLoaded) return;
    
    // Auto-rotation for all modes
    if (isHero) {
      // Slower rotation for hero section
      modelRef.current.rotation.y += (rotationSpeed * 0.75) * delta;
    } else if (!interactive) {
      // Regular rotation and bobbing for non-interactive mode
      modelRef.current.rotation.y += rotationSpeed * delta;
      
      // Only apply bobbing if animation is complete
      if (isAnimationComplete) {
        modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
      }
    }
  });

  return isLoaded ? (
    <group ref={modelRef}>
      <primitive object={clonedScene} position={[0, 0, 0]} />
    </group>
  ) : null;
};

export default DroneModel;