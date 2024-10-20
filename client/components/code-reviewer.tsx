"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface CodeReviewerProps {
  code: string;
}

const CodeReviewer: React.FC<CodeReviewerProps> = ({ code }) => {
  const [output, setOutput] = useState<string>("");

  const handleCodeOptimization = async () => {
    const prompt = `Improve the following code to reduce time complexity and minimize lines of code:\n\n${code}`;

    try {
      const result = await model.generateContent(prompt);
      setOutput(result.response.text());
    } catch (error) {
      console.error("Error generating optimized code:", error);
      setOutput(
        "Sorry, something went wrong while generating the optimized code."
      );
    }
  };

  const handleCodePrediction = async () => {
    const prompt = `Predict the next few lines of code that logically follow this:\n\n${code}`;

    try {
      const result = await model.generateContent(prompt);
      setOutput(result.response.text());
    } catch (error) {
      console.error("Error predicting further code:", error);
      setOutput(
        "Sorry, something went wrong while predicting further lines of code."
      );
    }
  };

  const handleCodeAnalysis = async () => {
    const prompt = `Analyze the following code for:\n1. Any syntax errors\n2. Potential functionality issues\n3. Suggestions for best practices\nIn a presentable format\nCode:\n${code}`;

    try {
      const result = await model.generateContent(prompt);
      setOutput(result.response.text());
    } catch (error) {
      console.error("Error analyzing code:", error);
      setOutput("Sorry, something went wrong while analyzing the code.");
    }
  };

  return (
    <div className="bg-[#252525] p-4 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold mb-4 text-white">Code Reviewer</h1>
      <Accordion type="single" collapsible>
        <AccordionItem value="optimize">
          <AccordionTrigger className="bg-gray-700 text-white">
            Optimize Code
          </AccordionTrigger>
          <AccordionContent>
            <Button onClick={handleCodeOptimization}>Optimize</Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="predict">
          <AccordionTrigger className="bg-gray-700 text-white">
            Predict Code
          </AccordionTrigger>
          <AccordionContent>
            <Button onClick={handleCodePrediction}>Predict</Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="analyze">
          <AccordionTrigger className="bg-gray-700 text-white">
            Analyze Code
          </AccordionTrigger>
          <AccordionContent>
            <Button onClick={handleCodeAnalysis}>Analyze</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-[#252525] text-white p-4 mt-2 rounded-[5px] h-64 overflow-y-auto">
        <h2 className="text-lg font-semibold">Output</h2>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

export default CodeReviewer;
