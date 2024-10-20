import React from "react";

interface AnalyseButtonProps {
  onClick: () => void;
}

const AnalyseButton: React.FC<AnalyseButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>Analyse code</button>;
};

export default AnalyseButton;
