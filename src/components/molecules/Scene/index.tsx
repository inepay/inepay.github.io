import React, {useState, useEffect, useRef} from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { PerspectiveCamera as PerspectiveCameraType } from 'three';
interface SceneProps extends CanvasProps {
  // Add any additional props for the scene
}

const Scene: React.FC<SceneProps> = (props) => {
  const [zoom, setZoom] = useState<number>(0.6); // Default zoom level
  const cameraRef = useRef<PerspectiveCameraType>(null);  // Specify the type for the ref
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
