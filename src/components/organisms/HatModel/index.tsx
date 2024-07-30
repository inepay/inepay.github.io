import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

//const path = '/assets/wcliepnqrny8-hat/hat';
const path = '/assets/FinalBaseMesh';

interface HatModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const HatModel = ({
  position = [0,0,0], //[0, -7.9, -5.6]
  rotation = [0, 0, 0], //[0, 12.6, 0]
  scale = [0.1,0.1,0.1]
}: HatModelProps) => {
  const hatRef = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(`${path}.mtl`, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(`${path}.obj`, (object) => {
        hatRef.current.add(object);
      }, undefined, (error) => {
        console.error('An error occurred while loading the model:', error);
      });
    });
  }, []);

  useFrame(() => {
    if (hatRef.current) {
      hatRef.current.position.set(...position);
      hatRef.current.rotation.set(...rotation);
      hatRef.current.scale.set(...scale);
    }
  });

  return <primitive object={hatRef.current} />;
};

export default HatModel;
