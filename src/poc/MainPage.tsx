import React, { useCallback, useEffect, useRef, useState } from 'react';
import DetectButton from './DetectButton';
import CaptureButton from './CaptureButton';
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/facemesh'
import Webcam from 'react-webcam';
import { drawMesh } from "../utils/triangulation";
import './style.scss'

async function main() {
  await tf.setBackend('webgl'); // Use WebGL backend
  // Load your model and perform operations
}

main();

const MainPage: React.FC = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [frontCamera, showFrontCamera] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const startCamera = () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      alert('Cannot show video because your webview version is ...' + ((window as any)?.NativeInterface?.getWebviewVersion()));
      return;
    }
    setIsVideoOn(true)
  }
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: frontCamera?"user":{ exact: "environment" }
  };

  
  return (
    <div>
      {!isVideoOn && (
        <div>
          <button onClick={()=>startCamera()}>Start Camera</button>
        </div>
      )}
      {isVideoOn && (
        <div>
          <button className="close" onClick={()=>setIsVideoOn(false)}>Stop Camera</button>
          <button className="close" onClick={()=>showFrontCamera(!frontCamera)}>Toggle camera</button>
          <Webcam
          ref={webcamRef}
          videoConstraints={videoConstraints}
          className="video"
        />
        </div>
      )}
    </div>
  );
};

export default MainPage;
