import React from "react";

interface OutputDisplayProps {
  output: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  return <pre>{output}</pre>; // Display output in a preformatted text block
};

export default OutputDisplay;
