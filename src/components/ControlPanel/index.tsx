// src/components/ControlPanel.tsx
import React, { useState } from 'react';

interface ControlPanelProps {
  onOptionChange: (options: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onOptionChange }) => {
  const [options, setOptions] = useState({
    selfieMode: true,
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    effect: 'background',
  });

  const handleChange = (field: string, value: any) => {
    const newOptions = { ...options, [field]: value };
    setOptions(newOptions);
    onOptionChange(newOptions);
  };

  return (
    <div className="control-panel">
      <div>
        <label>
          <input
            type="checkbox"
            checked={options.selfieMode}
            onChange={(e) => handleChange('selfieMode', e.target.checked)}
          />
          Selfie Mode
        </label>
      </div>
      {/* Add more controls as needed */}
    </div>
  );
};

export default ControlPanel;
