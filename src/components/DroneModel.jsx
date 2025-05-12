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
    setIsLoaded(true); // Mark as loaded once scene is cloned
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
    
    clonedScene.scale.set(scale, scale, scale);
  }, [clonedScene, color, propellerColor, steelBodyColor, scale, isHero]);

  // GSAP entry animation
  useEffect(() => {
    if (modelRef.current && isLoaded) {
      if (interactive) {
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
        // Simplified animation for hero section
        modelRef.current.position.set(0, -5, 5);
        modelRef.current.rotation.set(0, Math.PI / 4, 0);
        modelRef.current.scale.set(0, 0, 0);
        
        const heroTimeline = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });
        
        heroTimeline
          .to(modelRef.current.scale, {
            x: scale,
            y: scale,
            z: scale,
            duration: 1.5,
            ease: 'elastic.out(1, 0.7)',
            delay: 0.5 // Increased delay to ensure rendering
          })
          .to(modelRef.current.position, {
            y: 0,
            z: 0,
            duration: 1.8,
            ease: 'power3.out'
          }, '<') // Start simultaneously with scale
          .to(modelRef.current.rotation, {
            y: 0,
            duration: 2,
            ease: 'power3.out'
          }, '<')
          .to(modelRef.current.position, {
            y: '+=0.2',
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: 'sine.inOut'
          }, '+=0.5');
      }
    }
  }, [interactive, scale, isHero, isLoaded]);

  // Auto-rotation and bobbing
  useFrame((state, delta) => {
    if (modelRef.current && isLoaded) {
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
    const camera = size.width <= 320 ? { fov: 70, positionZ: 7 } : size.width < 768 ? { fov: 60, positionZ: 6 } : { fov: 50, positionZ: 5 };
    // Note: Camera adjustments should be handled in the parent Canvas
  }, [size]);

  return isLoaded ? (
    <group ref={modelRef}>
      <primitive object={clonedScene} position={[0, 0, 0]} />
    </group>
  ) : null;
};

export default DroneModel;