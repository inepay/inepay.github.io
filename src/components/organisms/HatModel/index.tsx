import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import * as holistic from '@mediapipe/holistic';
import faceLandmarkIndices from './faceIndexes'

function calculateHeadPosition(results: holistic.Results): THREE.Vector3 {
  // Access specific landmarks using indices
  const landmarks = results.faceLandmarks;
  const leftEyeOuterLandmark = landmarks[faceLandmarkIndices.leftEye.leftEyeOuter];
  const leftEyeOuter = new THREE.Vector3(leftEyeOuterLandmark.x,leftEyeOuterLandmark.y,leftEyeOuterLandmark.z);
  const rightEyeOuterLandmark = landmarks[faceLandmarkIndices.rightEye.rightEyeOuter];
  const rightEyeOuter = new THREE.Vector3(rightEyeOuterLandmark.x,rightEyeOuterLandmark.y,rightEyeOuterLandmark.z);
  const noseTipLandmark = landmarks[faceLandmarkIndices.nose.noseTip];
  const noseTip = new THREE.Vector3(noseTipLandmark.x,noseTipLandmark.y,noseTipLandmark.z);
  const eyeCenter = leftEyeOuter.add(rightEyeOuter).multiplyScalar(1);
  const headPosition = noseTip.add(eyeCenter).multiplyScalar(1);
  return headPosition;
}

// function calculateHeadRotation(landmarks: FaceLandmarks): THREE.Quaternion {
//   // ... calculate head rotation based on landmarks
//   return headRotation;
// }


//const path = '/assets/wcliepnqrny8-hat/hat';
//const path = '/assets/canonical_face_model';
const path = '/assets/face_model_with_iris';

interface HatModelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  subscribe: (callback: (results: holistic.Results) => void) => void;
  unsubscribe: (callback: (results: any) => void) => void;
}

const HatModel = ({
  videoRef,
  position = [0,0,0], //[0, -7.9, -5.6]
  rotation = [0, 0, 0], //[0, 12.6, 0]
  scale = [0.1,0.1,0.1], 
  subscribe, 
  unsubscribe
}: HatModelProps) => {
  const hatRef = useRef<THREE.Group>(new THREE.Group());
  const { scene } = useThree();
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

  useEffect(()=>{
    if (videoRef.current) {
      const videoTexture = new THREE.VideoTexture(videoRef.current);
      scene.background = videoTexture; // Set video as background
    }
  },[videoRef, scene])
 
  useFrame(() => {
    if (hatRef.current) {
      //console.log("kuku")
      //hatRef.current.position.set(...position);
      hatRef.current.rotation.set(...rotation);
      hatRef.current.scale.set(...scale);
    }
  });

  const handleResults = useCallback((results: holistic.Results) => {
    if (!hatRef.current || !videoRef.current) return;
    if (results.faceLandmarks) {
      //onst headPosition = calculateHeadPosition(results);
      //hatRef.current.position.copy(headPosition)
    //     // Logic to place the model on my forehead.
    //     // Assuming `results.faceLandmarks` provides the face landmarks in a specific format.
    // // Find the coordinates for the forehead or another suitable landmark.
    // // This example assumes using `NOSE_TIP` as a proxy for the forehead for simplicity.
    // const foreheadLandmark = results.faceLandmarks[10]; // Replace with actual index for forehead landmark
    // const { x, y, z } = foreheadLandmark;

    // // Define scaling factors for width, height, and depth
    // const widthFactor = 10;  // Adjust based on your scene's scale
    // const heightFactor = 10; // Adjust based on your scene's scale
    // const depthFactor = 10;  // Adjust based on your scene's scale

    // // Compute the model’s origin adjustment
    // const offsetX = x * widthFactor;
    // const offsetY = y * heightFactor;
    // const offsetZ = z * depthFactor;

    // // Move the hat model so its origin aligns with the forehead landmark
    // // First, set the hat's position to be the adjusted origin
    // hatRef.current.position.set(offsetX, offsetY, offsetZ);
    
    // // // Then, apply the model's local adjustments if needed
    // // hatRef.current.position.set(
    // //   hatRef.current.position.x - offsetX,
    // //   hatRef.current.position.y - offsetY,
    // //   hatRef.current.position.z - offsetZ
    // // );
    }
  },[hatRef, videoRef])

  useEffect(() => {
    subscribe(handleResults);
    return () => {
      unsubscribe(handleResults);
    };
  }, [handleResults, subscribe, unsubscribe]);

  return <primitive object={hatRef.current} />;
};

export default HatModel;
