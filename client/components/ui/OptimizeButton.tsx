import React from "react";

interface OptimizeButtonProps {
  onClick: () => void;
}

const OptimizeButton: React.FC<OptimizeButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>Suggest Better Code</button>;
};

export default OptimizeButton;
