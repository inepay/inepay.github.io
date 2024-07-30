import React, { useEffect, useState, useCallback } from 'react';
import * as holistic from '@mediapipe/holistic';

interface HolisticDrawingProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  subscribe: (callback: (results: holistic.Results) => void) => void;
  unsubscribe: () => void;
}

const HolisticDrawing: React.FC<HolisticDrawingProps> = ({ videoRef, canvasRef, subscribe, unsubscribe }) => {
  const [hatPosition, setHatPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [hatRotation, setHatRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [hatScale, setHatScale] = useState<[number, number, number]>([1, 1, 1]);

  const handleResults = useCallback((results: holistic.Results) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasCtx.drawImage(results.image, 0, 0, canvasWidth, canvasHeight);

    if (results.faceLandmarks) {
      const forehead = results.faceLandmarks[10];
      const hatX = forehead.x * canvasWidth;
      const hatY = forehead.y * canvasHeight;
      const hatZ = -200;

      setHatPosition([hatX - canvasWidth / 2, hatY - canvasHeight / 2, hatZ]);

      const leftEye = results.faceLandmarks[33];
      const rightEye = results.faceLandmarks[263];
      const nose = results.faceLandmarks[1];

      const dx = rightEye.x - leftEye.x;
      const dy = rightEye.y - leftEye.y;
      const angleY = Math.atan2(dy, dx);

      const dz = nose.z - forehead.z;
      const angleX = Math.atan2(dz, dy);

      setHatRotation([angleX, angleY, 0]);
    }

    canvasCtx.restore();
  }, [canvasRef, videoRef]);

  useEffect(() => {
    subscribe(handleResults);
    return () => {
      unsubscribe();
    };
  }, [handleResults, subscribe, unsubscribe]);

  return null; // This component doesn't render anything
};

export default HolisticDrawing;
