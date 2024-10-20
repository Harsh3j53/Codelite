import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { useEffect, useRef, useState } from "react";
import socket from "@/socket";
import "xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [terminal, setTerminal] = useState<XTerminal | null>(null);
  const [fitAddon, setFitAddon] = useState<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current || terminal) return;

    const term = new XTerminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "monospace",
      theme: {
        background: "#1e1e1e",
      },
    });

    const fit = new FitAddon();
    term.loadAddon(fit);

    term.open(terminalRef.current);
    setTerminal(term);
    setFitAddon(fit);

    return () => {
      term.dispose();
    };
  }, []);

  useEffect(() => {
    if (!terminal || !fitAddon) return;

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(terminalRef.current!);

    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);

    fitAddon.fit();

    const onData = (data: string) => {
      socket.emit("terminal:input", data);
    };

    const onTerminalData = (data: string) => {
      terminal.write(data);
    };

    terminal.onData(onData);
    socket.on("terminal:data", onTerminalData);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      terminal.write("\r\nConnected to the terminal server.\r\n");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      terminal.write("\r\nDisconnected from the terminal server.\r\n");
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      socket.off("terminal:data", onTerminalData);
    };
  }, [terminal, fitAddon]);
  return (
    <div
      ref={terminalRef}
      className="bg-black"
      style={{
        // width: "100%",
        // height: "100%", // Changed to fill the container
        // backgroundColor: "black",

      }}
    />
  );
}

export default Terminal;
