"use client";

import React, { useState, useEffect } from "react";
import { Bug, Zap, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ToolbarButtonProps {
  icon: React.ElementType;
  label?: string;
  onClick?: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    className="flex items-center space-x-2 border-gray-500 p-2 text-white rounded-[5px]"
    onClick={onClick}
  >
    <div className="bg-[#252525] p-2 border border-gray-700 rounded-[5px]">
      <Icon size={18} />
    </div>
    {label && <span className="text-sm font-medium">{label}</span>}
  </button>
);

export default function AnalysisPage() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string>("");
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      console.error("NEXT_PUBLIC_API_KEY is not defined");
      return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    setModel(genAI.getGenerativeModel({ model: "gemini-1.5-flash" }));
  }, []);

  const getOptimizedCode = async () => {
    if (!model) return;
    const prompt = `Please review the following code and provide an optimized version that reduces time complexity and minimizes the number of lines. Explain the changes you made and why they improve the code:\n\n${code}`;
    try {
      const result = await model.generateContent(prompt);
      const apiResponse = result.response.text().replace(/\*/g, "");
      setOutput(apiResponse);
    } catch (error) {
      console.error("Error optimizing code:", error);
      setOutput("Sorry, something went wrong while optimizing the code.");
    }
  };

  const predictFurtherCode = async () => {
    if (!model) return;
    const prompt = `Based on the provided code, predict the next few lines that logically follow. Ensure that the continuation maintains the same coding style and functionality. Provide comments where necessary:\n\n${code}`;
    try {
      const result = await model.generateContent(prompt);
      const apiResponse = result.response.text().replace(/\*/g, "");
      setOutput(apiResponse);
    } catch (error) {
      console.error("Error predicting code:", error);
      setOutput("Sorry, something went wrong while predicting the code.");
    }
  };

  const handleCodeAnalysis = async () => {
    if (!model) return;
    const prompt = `Please analyze the following code for:\n1. Any syntax errors\n2. Potential functionality issues\n3. Suggestions for best practices\n\nPresent your findings in a clear and structured format with headings for each section:\n\n${code}`;
    try {
      const result = await model.generateContent(prompt);
      const apiResponse = result.response.text().replace(/\*/g, "");
      setOutput(apiResponse);
    } catch (error) {
      console.error("Error analyzing code:", error);
      setOutput("Sorry, something went wrong while analyzing the code.");
    }
  };

  return (
    <div className="bg-[#1e1e1e] w-full min-h-screen flex flex-col">
      <div className="flex space-x-2 flex-row bg-black p-4">
        <div className="flex space-x-2 w-full">
          <ToolbarButton
            icon={Bug}
            label="Debug"
            onClick={handleCodeAnalysis}
          />
          <ToolbarButton
            icon={Zap}
            label="Optimize"
            onClick={getOptimizedCode}
          />
          <ToolbarButton
            icon={FileText}
            label="Predict"
            onClick={predictFurtherCode}
          />
        </div>
        <div className="flex items-center gap-1 justify-end w-full">
          <ToolbarButton icon={Bot} />
        </div>
      </div>
      <div className="flex border-t-[1px] border-t-gray-500 flex-1 overflow-hidden">
        <div className="flex-1 flex-column p-4 relative">
          <div className="flex-1">
            <div className="bg-[#1e1e1e] text-white font-mono">
              <div className="flex bg-[#252525] text-sm">
                <div className="p-2 border-r border-gray-700">analysis.txt</div>
                <div className="p-2 border-r border-gray-700">1</div>
                <div className="p-2">1 / 0</div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[400px] bg-[#1e1e1e] text-white p-2"
                placeholder="Paste your code here for analysis..."
              />
            </div>
          </div>
          <div className="flex flex-row justify-between mt-2">
            <Button
              onClick={getOptimizedCode}
              className="bg-orange-600 rounded-[5px]"
            >
              Optimize Code
            </Button>
            <Button
              onClick={predictFurtherCode}
              className="bg-blue-600 rounded-[5px]"
            >
              Predict Code
            </Button>
            <Button
              onClick={handleCodeAnalysis}
              className="bg-green-600 rounded-[5px]"
            >
              Analyze Code
            </Button>
          </div>
          <div className="bg-[#252525] text-white p-4 mt-2 rounded-[5px] h-[300px] overflow-y-auto">
            <h2 className="text-lg font-semibold">Analysis Output</h2>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
