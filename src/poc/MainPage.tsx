import React, { useCallback, useEffect, useRef, useState } from 'react';
import DetectButton from './DetectButton';
import CaptureButton from './CaptureButton';

const MainPage: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Handle the selected file here
      console.log('Selected file:', file);
    }
  };

  return (
    <div>
      {/* Your main content here */}
      <DetectButton onClick={handleDetectButtonClick} />
      <CaptureButton onClick={handleCaptureButtonClick} />
      {isVideoOn && (
        <div>
          <video ref={videoRef} width="100%" height="auto" autoPlay />
          <button onClick={stopCamera}>Stop Camera</button>
          <button onClick={toggleCamera}>Toggle Camera</button>
        </div>
      )}
      {!isVideoOn && (
        <div>
          <button onClick={startCamera}>Start Camera</button>
          <input type="file" accept="image/*" onChange={handleFileInputChange} />
        </div>
      )}
    </div>
  );
};

export default MainPage;
