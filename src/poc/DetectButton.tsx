import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3498db;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface DetectButtonProps {
  onClick: () => void;
}

const DetectButton: React.FC<DetectButtonProps> = ({ onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <span>🔍</span>
    </StyledButton>
  );
};

export default DetectButton;
