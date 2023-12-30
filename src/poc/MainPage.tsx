import React from 'react';
import DetectButton from './DetectButton';
import CaptureButton from './CaptureButton';

const MainPage: React.FC = () => {
  const handleDetectButtonClick = () => {
    // Handle navigation to the view for detecting car seats
    console.log('Navigate to car seat detection view');
  };

  const handleCaptureButtonClick = () => {
    // Handle navigation to the view for capturing video to train models
    console.log('Navigate to video capture view');
  };

  return (
    <div>
      {/* Your main content here */}
      <DetectButton onClick={handleDetectButtonClick} />
      <CaptureButton onClick={handleCaptureButtonClick} />
    </div>
  );
};

export default MainPage;
