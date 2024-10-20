import React from "react";

interface CodeInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ value, onChange }) => {
  return (
    <textarea
      rows={10}
      cols={50}
      value={value}
      onChange={onChange}
      placeholder="Enter your code here..."
    />
  );
};

export default CodeInput;
