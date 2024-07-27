// MainPage.tsx
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useModel } from './ModelContext'; // Import the useModel hook
import FaceDetector from './FaceDetector'; // Import the FaceDetector component
import './style.scss';

interface VideoConstraints {
  width: number;
  height: number;
  facingMode: string | { exact: string };
}

const videoConstraints = (frontCamera: boolean): VideoConstraints => ({
  width: 1280,
  height: 720,
  facingMode: frontCamera ? 'user' : { exact: 'environment' },
});

const MainPage: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const model = useModel(); // Access the model from the context

  const startCamera = () => setIsVideoOn(true);
  const stopCamera = () => setIsVideoOn(false);

  // Extract video element from the Webcam ref
  const getVideoElement = () => webcamRef.current?.video ?? null;

  return (
    <div>
      {!isVideoOn && <button onClick={startCamera}>Start Camera</button>}
      {isVideoOn && (
        <div>
          <button onClick={stopCamera}>Stop Camera</button>
          <button onClick={() => setFrontCamera(!frontCamera)}>Toggle Camera</button>
          <div className="wrapper">
            <Webcam
              ref={webcamRef}
              videoConstraints={videoConstraints(frontCamera)}
              screenshotFormat="image/jpeg"
              className="wrapper__video"
            />
            <canvas 
              ref={canvasRef} 
              style={{ position: 'absolute', top: 0 }}
              className="wrapper__canvas" />
            {model && (
              <FaceDetector
                model={model}
                videoElement={getVideoElement()}
                canvasRef={canvasRef}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
