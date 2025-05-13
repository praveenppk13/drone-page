import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'; // Import DRACOLoader

const DroneModel = ({ 
  interactive = false, 
  color, 
  propellerColor,
  steelBodyColor,
  scale = 1, 
  isHero = false 
}) => {
  // Configure DRACOLoader for useGLTF
  const dracoLoader = useMemo(() => {
    const draco = new DRACOLoader();
    // Set path to Draco decoder files (using CDN for simplicity)
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    draco.setDecoderConfig({ type: 'js' }); // Use JavaScript decoder (can also use 'wasm' for better performance)
    return draco;
  }, []);

  // Load the Draco-compressed model
  const { scene } = useGLTF('/models/dronec.glb', true, (loader) => {
    loader.setDRACOLoader(dracoLoader); // Attach DRACOLoader to GLTFLoader
  });

  const modelRef = useRef();
  const rotationSpeed = 0.075;
  const { size } = useThree();
  const hasLogged = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // Determine the appropriate scale based on screen width
  const responsiveScale = useMemo(() => {
    if (window.innerWidth < 768) {
      return isHero ? scale * 1.1 : scale * 1.1;
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

  // Keep track of whether component has initialized
  useEffect(() => {
    if (!hasLogged.current) {
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
    
    clonedScene.scale.set(responsiveScale, responsiveScale, responsiveScale);
  }, [clonedScene, color, propellerColor, steelBodyColor, responsiveScale, isHero, isLoaded]);

  // Set initial position and run animations
  useEffect(() => {
    if (!modelRef.current || !isLoaded) return;
    
    if (isHero) {
      modelRef.current.position.set(0, 0, 0);
      modelRef.current.rotation.set(0, 0, 0);
      modelRef.current.visible = true;
      
      const heroTimeline = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.out' },
        onComplete: () => setIsAnimationComplete(true)
      });
      
      modelRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale);
      
      heroTimeline.to(modelRef.current.position, {
        y: '+=0.2',
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut'
      });
    } 
    else if (interactive) {
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
      modelRef.current.position.set(0, 0, 0);
      modelRef.current.rotation.set(0, 0, 0);
      modelRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale);
      setIsAnimationComplete(true);
    }
  }, [interactive, responsiveScale, isHero, isLoaded]);

  // Auto-rotation and bobbing
  useFrame((state, delta) => {
    if (!modelRef.current || !isLoaded) return;
    
    if (isHero) {
      modelRef.current.rotation.y += (rotationSpeed * 0.75) * delta;
    } else if (!interactive) {
      modelRef.current.rotation.y += rotationSpeed * delta;
      
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