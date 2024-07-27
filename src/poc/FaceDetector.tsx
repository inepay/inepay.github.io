// FaceDetector.tsx
import React, { useRef, useCallback, useEffect } from 'react';
import { drawMesh } from '../utils/triangulation'; // Import drawMesh function

interface FaceDetectorProps {
  model: any; // Type according to your model
  videoElement: HTMLVideoElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const FaceDetector: React.FC<FaceDetectorProps> = ({ model, videoElement, canvasRef }) => {
  const requestRef = useRef<number | null>(null);

  const detectFace = useCallback(async () => {
    const canvas = canvasRef.current;

    if (!videoElement || !model || !canvas || videoElement.readyState !== 4) {
      requestRef.current = requestAnimationFrame(detectFace);
      return;
    }

    try {
      const faceEstimates = await model.estimateFaces(videoElement);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
        if (faceEstimates.length > 0) {
          drawMesh(faceEstimates, ctx);
        } else {
          console.error('No faces detected.');
        }
      }
    } catch (error) {
      console.error('FaceMesh estimation failed:', error);
    }

    requestRef.current = requestAnimationFrame(detectFace);
  }, [model, videoElement, canvasRef]);

  useEffect(() => {
    if (videoElement) {
      const handleLoadedData = () => {
        if (requestRef.current === null) {
          requestRef.current = requestAnimationFrame(detectFace);
        }
      };

      if (videoElement.readyState === 4) {
        handleLoadedData();
      } else {
        videoElement.addEventListener('loadeddata', handleLoadedData);
      }

      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas when video stops
        }
      };
    }
  }, [detectFace, videoElement, canvasRef]);

  return null;
};

export default FaceDetector;
