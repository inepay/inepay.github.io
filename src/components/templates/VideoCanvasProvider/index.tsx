import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as cam from '@mediapipe/camera_utils';
import * as holistic from '@mediapipe/holistic';
import * as facemesh from "@mediapipe/face_mesh";

interface VideoCanvasProviderProps {
  children: (props: {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    subscribe: (callback: (results: any) => void) => void;
    unsubscribe: (callback: (results: any) => void) => void;
  }) => React.ReactNode;
}

const VideoCanvasProvider: React.FC<VideoCanvasProviderProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holisticModel = new holistic.Holistic({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
  });

  holisticModel.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    //enableFaceGeometry:true,
  });

  const [subscribers, setSubscribers] = useState<((results: any) => void)[]>([]);

  const subscribe = useCallback((callback: (results: any) => void) => {
    setSubscribers(prev => [...prev, callback]);
  }, []);

  const unsubscribe = useCallback((callback: (results: any) => void) => {
    setSubscribers(prev => prev.filter(sub => sub !== callback));
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
 
    const handleResults = async (results: any) => {
      subscribers.forEach(callback => callback(results));
    };

    holisticModel.onResults(handleResults);

    // Initialize camera
    const camera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await holisticModel.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [subscribers]);

  return <>{children({ videoRef, canvasRef, subscribe, unsubscribe })}</>;
};

export default VideoCanvasProvider;
