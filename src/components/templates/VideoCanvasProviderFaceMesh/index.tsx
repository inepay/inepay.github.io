import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as cam from '@mediapipe/camera_utils';
import * as facemesh from '@mediapipe/face_mesh';

interface VideoCanvasProviderProps {
  children: (props: {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    subscribe: (callback: (results: any) => void) => void;
    unsubscribe: (callback: (results: any) => void) => void;
    switchCamera: () => void;
  }) => React.ReactNode;
}

const VideoCanvasProvider: React.FC<VideoCanvasProviderProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const facemeshModel = new facemesh.FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  facemeshModel.setOptions({
    maxNumFaces: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    enableFaceGeometry: true,
  });

  const [subscribers, setSubscribers] = useState<((results: any) => void)[]>([]);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');

  const subscribe = useCallback((callback: (results: any) => void) => {
    setSubscribers(prev => [...prev, callback]);
  }, []);

  const unsubscribe = useCallback((callback: (results: any) => void) => {
    setSubscribers(prev => prev.filter(sub => sub !== callback));
  }, []);

  const switchCamera = useCallback(() => {
    setCameraFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const handleResults = async (results: any) => {
      subscribers.forEach(callback => callback(results));
    };

    facemeshModel.onResults(handleResults);

    // Initialize camera
    const camera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await facemeshModel.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
      facingMode: cameraFacingMode,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [subscribers, facemeshModel, cameraFacingMode]);

  return (
    <div>
      <h1>Hey jude</h1>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} />
      <button onClick={switchCamera} aria-label="Switch Camera">Switch Camera</button>
      {children({ videoRef, canvasRef, subscribe, unsubscribe, switchCamera })}
    </div>
  );
};

export default VideoCanvasProvider;
