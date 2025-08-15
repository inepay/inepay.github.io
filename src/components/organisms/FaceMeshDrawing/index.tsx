import React, { useEffect, useState, useCallback, useRef } from 'react';
//import * as holistic from '@mediapipe/holistic';
import * as faceMesh from '@mediapipe/face_mesh';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import drawAndFillLoop, {drawImageAtIndex} from './brush'
/*
Check alternate solution here https://mediapipe.readthedocs.io/en/latest/solutions/face_mesh.html
*/


const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
    ctx.fillStyle = 'blue'; // Text color
    ctx.font = '12px Arial'; // Text font and size
    ctx.fillText(text, x, y); // Draw the text on the canvas
};



interface DrawingProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  subscribe: (callback: (results: faceMesh.Results) => void) => void;
  unsubscribe: (callback: (results: any) => void) => void;
}
//let k = 0;
const Drawing: React.FC<DrawingProps> = ({ videoRef, canvasRef, subscribe, unsubscribe }) => {

    const imageRef = useRef<HTMLImageElement | null>(null);
  const [hatPosition, setHatPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [hatRotation, setHatRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [hatScale, setHatScale] = useState<[number, number, number]>([1, 1, 1]);

const handleResults = useCallback((results: faceMesh.Results) => {
  if (!canvasRef.current || !videoRef.current || !imageRef.current) return;

  const canvasCtx = canvasRef.current.getContext('2d');
  if (!canvasCtx) return;
  const canvasWidth = canvasRef.current.width;
  const canvasHeight = canvasRef.current.height;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  canvasCtx.drawImage(results.image, 0, 0, canvasWidth, canvasHeight);

  // Check if landmarks are available under a different property
//   const upperLipOuter = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
//     const lowerLipOuter = [146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
// const upperLipOuter = [61, 185, 40, 39, 37, 0, 267, 269, 270, 270, 291, 308, 324, 318, 402, 317, 14, 87, 178];
const upperLipOuter = [61, 185, 40, 39, 37, 0, 267, 269, 270, 270, 287];
const lowerLipOuter = [61, 78, 183, 80, 81, 82, 13, 212, 311, 310, 415, 308, 287];


if (results.multiFaceLandmarks) {
  for (const landmarks of results.multiFaceLandmarks) {
    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    // Define the path for the upper lip
    canvasCtx.beginPath();
    canvasCtx.moveTo(landmarks[upperLipOuter[0]].x * canvasWidth, landmarks[upperLipOuter[0]].y * canvasHeight);
    upperLipOuter.forEach(index => {
      canvasCtx.lineTo(landmarks[index].x * canvasWidth, landmarks[index].y * canvasHeight);
      // Draw landmark index and coordinates
    //   drawText(canvasCtx, `#${index}: (${landmarks[index].x.toFixed(2)}, ${landmarks[index].y.toFixed(2)})`, 
    //            landmarks[index].x * canvasWidth + 5, landmarks[index].y * canvasHeight + 5);
    });
    canvasCtx.closePath();

    // Define the path for the lower lip
    canvasCtx.moveTo(landmarks[lowerLipOuter[0]].x * canvasWidth, landmarks[lowerLipOuter[0]].y * canvasHeight);
    lowerLipOuter.forEach(index => {
      canvasCtx.lineTo(landmarks[index].x * canvasWidth, landmarks[index].y * canvasHeight);
    });
    canvasCtx.closePath();

    // Fill the lips
    canvasCtx.fillStyle = 'rgba(255, 0, 0,0.4)'; // Red color with 80% opacity
    canvasCtx.fill();
  }
}


  if (results.multiFaceLandmarks && imageRef.current) {
    //console.log("Jude",results.multiFaceLandmarks)
    // const specificIndices = [266,425,280,347,348];
    //     const options = {
    //         color: 'blue', // Color for the outline
    //         fillColor: 'rgba(255, 0, 0, 0.2)', // Fill color with transparency
    //         radius:2
    //     };
    drawImageAtIndex(canvasCtx, results.multiFaceLandmarks[0], 348 ,imageRef.current)
    for (const landmarks of results.multiFaceLandmarks) {
        //const lipColor = 'rgba(0, 255, 0, 0.8)'; 
        //const specificIndices = [52,40,39,37,0,267]; // Tip of the nose and corners of the mouth
        
        //drawAndFillLoop(canvasCtx, results.multiFaceLandmarks[0], specificIndices, options);
        //drawImageAtIndex(canvasCtx, landmarks, specificIndices[0], 'assets/blush.png', options);
        // https://i.sstatic.net/aGdBV.jpg
        //drawSpecificLandmarks(canvasCtx, landmarks, specificIndices, {color: 'green', radius: 3});
        // Draw other facial features with less emphasis or as needed
        // drawLandmarks(canvasCtx, landmarks, {color: lipColor, lineWidth: 4});
        // drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_FACE_OVAL, {color: '#C0C0C070', lineWidth: 0.5});

        // Draw lips with specific color and opacity
        //drawLandmarks(canvasCtx, landmarks, {color: lipColor, lineWidth: 4});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_TESSELATION,{color: '#C0C0C070', lineWidth: 1});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_RIGHT_EYE, {color: '#FF3030'});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_LEFT_EYE, {color: '#30FF30'});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_LEFT_IRIS, {color: '#30FF30'});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
    //   drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_LIPS, {color: '#E0E0E0'});
      
    }
  }

  canvasCtx.restore();
}, [canvasRef, videoRef, imageRef]);
    useEffect(()=>{
        
        if(canvasRef.current?.getContext('2d') && imageRef.current){
            console.log("draw this here")
            const maxWidth = 200;  // Maximum width you want for the image
            const maxHeight = 200; // Maximum height you want for the image
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = imageRef.current;
            const aspectRatio = img.width / img.height;
            const desiredWidth = maxWidth;
            const desiredHeight = desiredWidth / aspectRatio;
            img.width = desiredWidth;
            img.height = desiredHeight;
            //  // Clear the canvas
            //  ctx.clearRect(0, 0, canvas.width, canvas.height);

            //  // Draw the resized image
            //  ctx.drawImage(img, (canvas.width - desiredWidth) / 2, (canvas.height - desiredHeight) / 2, desiredWidth, desiredHeight);
        }
    },[canvasRef,imageRef])
    useEffect(() => {
        // Initialize image
        const img = new Image();
        img.src = 'assets/blush.png'; // Replace with your image URL
        img.onload = () => {
            imageRef.current = img; // Save the loaded image
            //draw(); // Draw the image on the canvas after loading
        };
        img.onerror = (error) => {
            console.error("Error loading image:", error);
        };
    }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    subscribe(handleResults);
    return () => {
      unsubscribe(handleResults);
    };
  }, [handleResults, subscribe, unsubscribe]);

  return null; // This component doesn't render anything
};

export default Drawing;
