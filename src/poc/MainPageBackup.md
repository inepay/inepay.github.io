import React, { useCallback, useEffect, useRef, useState } from 'react';
import DetectButton from './DetectButton';
import CaptureButton from './CaptureButton';
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/facemesh'
import Webcam from 'react-webcam';
import { drawMesh } from "../utils/triangulation";

async function main() {
  await tf.setBackend('webgl'); // Use WebGL backend
  // Load your model and perform operations
}

main();

const MainPage: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

   // Load posenet
// Load facemesh

  const handleDetectButtonClick = () => {
    // Handle navigation to the view for detecting car seats
    console.log('Navigate to car seat detection view');
  };

  const handleCaptureButtonClick = () => {
    // Handle navigation to the view for capturing video to train models
    console.log('Navigate to video capture view');
  };

  const startCamera = useCallback(() => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      alert('Cannot show video because your webview version is ...' + ((window as any)?.NativeInterface?.getWebviewVersion()));
      return;
    }
    console.log("waka 1")
    const runFacemesh = async () => {
      const net = await facemesh.load();
      setInterval(() => {
        detect(net);
      }, 10);
    };
    console.log("waka 2")
    const detect = async (net: facemesh.FaceMesh) => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video!;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
    
        // Set video width
        video.width = videoWidth;
        video.height = videoHeight;
    
        // Set canvas width
        if (canvasRef.current) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }
    
        // Make Detections
        const face = await net.estimateFaces(video);
        //console.log(face);
    
        // Get canvas context
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          requestAnimationFrame(() => {
            drawMesh(face, ctx);
          });
        }
      }
    };
    console.log("waka 3")
    runFacemesh();
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(newStream) {
        setStream(newStream);
        setIsVideoOn(true);
      })
      .catch(function(error) {
        // Handle error
        console.error('Error starting camera:', error);
        alert("Error opening camera: " + error);
      });
  }, []);

  useEffect(() => {
    if (!stream || !videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [videoRef, stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
      setIsVideoOn(false);
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    stopCamera();
    startCamera();
  };

  // const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files && event.target.files[0];
  //   if (file) {
  //     // Handle the selected file here
  //     console.log('Selected file:', file);
  //   }
  // };

  return (
    <div>
      {/* Your main content here */}
      <DetectButton onClick={handleDetectButtonClick} />
      <CaptureButton onClick={handleCaptureButtonClick} />
      {isVideoOn && (
        <div className="App-header">
          {/* <video ref={videoRef} width="100%" height="auto" autoPlay /> */}
          <button onClick={stopCamera}>Stop Camera</button>
          <button onClick={toggleCamera}>Toggle Camera</button>
          <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        </div>
      )}
      {!isVideoOn && (
        <div>
          <button onClick={startCamera}>Start Camera</button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
