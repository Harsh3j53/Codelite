import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import socket from "@/socket";

import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const term = new XTerminal({
      rows: 20,
    });

    if (terminalRef.current) {
      term.open(terminalRef.current);
    }

    // Alert or console log when socket connects to the backend
    socket.on("connect", () => {
      console.log("Socket connected: ", socket.id); // For logging in the console
      alert("Socket connected!"); // Or trigger an alert
    });

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    function onTerminalData(data: string) {
      term.write(data);
    }

    socket.on("terminal:data", onTerminalData);

    return () => {
      socket.off("terminal:data", onTerminalData);
    };
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;
