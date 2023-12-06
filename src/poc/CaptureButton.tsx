import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CaptureButtonProps {
  onClick: () => void;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <span>📷</span>
    </StyledButton>
  );
};

export default CaptureButton;
