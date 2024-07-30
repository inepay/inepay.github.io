import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as cam from '@mediapipe/camera_utils';

interface VideoCanvasProviderProps {
  children: (props: {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    subscribe: (callback: (results: any) => void) => void;
    unsubscribe: () => void;
  }) => React.ReactNode;
}

const VideoCanvasProvider: React.FC<VideoCanvasProviderProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [subscribeCallback, setSubscribeCallback] = useState<((results: any) => void) | null>(null);

  const subscribe = useCallback((callback: (results: any) => void) => {
    setSubscribeCallback(() => callback);
  }, []);

  const unsubscribe = useCallback(() => {
    setSubscribeCallback(null);
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const handleResults = async (results: any) => {
      if (subscribeCallback) {
        subscribeCallback(results);
      }
    };

    // Initialize camera
    const camera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        // Simulating sending frame for processing
        await handleResults({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [subscribeCallback]);

  return <>{children({ videoRef, canvasRef, subscribe, unsubscribe })}</>;
};

export default VideoCanvasProvider;
