import React from "react";

interface PredictButtonProps {
  onClick: () => void;
}

const PredictButton: React.FC<PredictButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>Predict Further Code</button>;
};

export default PredictButton;
