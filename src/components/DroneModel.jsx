import React, { useRef, useEffect, useMemo } from 'react';
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
  
  // Clone the scene to avoid conflicts between canvases
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone material and store original color
        child.material = child.material.clone();
        child.originalColor = child.material.color.clone();
        // For customization section, switch to MeshBasicMaterial
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
  }, [scene]);

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
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (!isHero) {
          // Apply color to body (Object_150 and Object_50)
          if (child.name === 'Object_150' || child.name === 'Object_50') {
            const targetColor = new THREE.Color(color || child.originalColor);
            child.material.color.set(targetColor);
            child.material.needsUpdate = true;
          }
          // Apply color to propellers (Object_163)
          if (child.name === 'Object_163') {
            const targetPropellerColor = new THREE.Color(propellerColor || child.originalColor);
            child.material.color.set(targetPropellerColor);
            child.material.needsUpdate = true;
          }
          // Apply color to steel body (Object_18 and Object_46)
          if (child.name === 'Object_18' || child.name === 'Object_46') {
            const targetSteelBodyColor = new THREE.Color(steelBodyColor || child.originalColor);
            child.material.color.set(targetSteelBodyColor);
            child.material.needsUpdate = true;
          }
        } else {
          // Hero section: Use original colors
          if (child.originalColor) {
            child.material.color.set(child.originalColor);
            child.material.needsUpdate = true;
          }
        }
      }
    });
    
    // Apply scale
    clonedScene.scale.set(scale, scale, scale);
  }, [clonedScene, color, propellerColor, steelBodyColor, scale, isHero]);

  // GSAP entry animation
  useEffect(() => {
    if (modelRef.current) {
      if (interactive) {
        // Animation for customization section (unchanged)
        modelRef.current.position.set(0, -5, 8);
        modelRef.current.rotation.set(Math.PI / 6, Math.PI / 4, 0);
        modelRef.current.scale.set(0.2, 0.2, 0.2);
        
        const timeline = gsap.timeline({
          defaults: { ease: 'elastic.out(1, 0.75)', duration: 2 }
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
            x: scale,
            y: scale,
            z: scale,
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
      } else if (isHero) {
        // Animation for hero section (optimized for mobile)
        const isMobile = size.width < 768;
        modelRef.current.position.set(0, isMobile ? -1 : -2, isMobile ? 2 : 4);
        modelRef.current.rotation.set(0, 0, 0);
        modelRef.current.scale.set(scale * 0.4, scale * 0.4, scale * 0.4);
        
        const heroTimeline = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });
        
        heroTimeline
          .to(modelRef.current.scale, {
            x: scale,
            y: scale,
            z: scale,
            duration: isMobile ? 0.8 : 1.0,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(modelRef.current.position, {
            y: 0,
            z: 0,
            duration: isMobile ? 0.8 : 1.2,
            ease: 'power4.inOut'
          }, 0)
          .to(modelRef.current.rotation, {
            x: 0.1,
            y: -0.2,
            z: 0,
            duration: isMobile ? 0.8 : 1.2,
            ease: 'power2.inOut'
          }, 0)
          .to(modelRef.current.position, {
            y: '+=0.3',
            repeat: -1,
            yoyo: true,
            duration: 2.5,
            ease: 'sine.inOut'
          }, '+=0.3')
          .to(modelRef.current.rotation, {
            x: '+=0.08',
            z: '+=0.05',
            repeat: -1,
            yoyo: true,
            duration: 3.5,
            ease: 'sine.inOut'
          }, '-=1.8');
      }
    }
  }, [interactive, scale, isHero, size.width]);

  // Auto-rotation and bobbing
  useFrame((state, delta) => {
    if (modelRef.current) {
      if (!interactive && !isHero) {
        modelRef.current.rotation.y += rotationSpeed * delta;
        modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
      } else if (isHero) {
        modelRef.current.rotation.y += (rotationSpeed * 1.5) * delta;
      }
    }
  });

  // Adjust camera for responsiveness
  useEffect(() => {
    const camera = size.width < 768 ? { fov: 60, positionZ: 4 } : { fov: 50, positionZ: 5 };
    return () => {
      // Cleanup if needed
    };
  }, [size]);

  return (
    <group ref={modelRef}>
      <primitive object={clonedScene} position={[0, 0, 0]} />
    </group>
  );
};

export default DroneModel;