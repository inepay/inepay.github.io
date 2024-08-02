import React, {useState, useEffect, useRef} from 'react';
import { Canvas, CanvasProps, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Vector3, VideoTexture, PlaneGeometry, MeshBasicMaterial, Mesh } from 'three';

import { PerspectiveCamera as PerspectiveCameraType } from 'three';
import HatModel from '../../organisms/HatModel';

interface VideoMeshProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoMesh: React.FC<VideoMeshProps> = ({ videoRef }) => {
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (videoRef.current) {
      const newVideoTexture = new VideoTexture(videoRef.current);
      setVideoTexture(newVideoTexture);
      scene.background = newVideoTexture; // Optionally set as background
    }
  }, [videoRef, videoRef.current, scene]);

  if (!videoTexture) {
    return null; // Return null if video texture is not available
  }

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial map={videoTexture} toneMapped={false} />
    </mesh>
  );
};


interface SceneProps extends CanvasProps {
  // Add any additional props for the scene
  videoRef: React.RefObject<HTMLVideoElement>;
}

const Scene: React.FC<SceneProps> = (props) => {
  const [zoom, setZoom] = useState<number>(0.6); // Default zoom level
  const cameraRef = useRef<PerspectiveCameraType>(null);  // Specify the type for the ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState<number>(1); // Added state
  const [directionalLightPosition, setDirectionalLightPosition] = useState<[number, number, number]>([10, 10, 10]); // Added position
  useEffect(() => {
    if (cameraRef.current) {
      // Assuming the model or point of interest is at the origin
      cameraRef.current.lookAt(new Vector3(0, 0, 0));
    }
  }, [cameraRef]);
  
  return (
    <Canvas {...props}>
      {/* Add your scene setup here */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <directionalLight
            position={directionalLightPosition} // Adjustable directional light position
            intensity={directionalLightIntensity}
            castShadow               // Enable shadows if needed
        />
      {/* Render additional objects or components */}
        {/* Perspective Camera */}
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 0, 5]}  // Camera position
          fov={75}        // Adjust FOV for zoom effect
          aspect={640 / 480}      // Aspect Ratio
          near={0.1}             // Near Clipping Plane
          far={1000}             // Far Clipping Plane
        />
        <OrbitControls />
        {/* <VideoMesh videoRef={videoRef} />  Include the video mesh here */}
      {props.children}
      <axesHelper args={[5]} />
      //Debug Box
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1,0.1,0.1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
};

export default Scene;
