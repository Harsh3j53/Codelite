const express = require("express");
const http = require("http");
const { Server: SocketServer } = require("socket.io");
const pty = require("node-pty");
const path = require("path");
const fs = require("fs/promises");
const cors = require("cors");
const chokidar = require("chokidar");

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Set default directory
const defaultDirectory = "/Users/harshdeshmukh/downloads/Codelite/server/user";

// Dashboard route
app.get("/dashboard", (req, res) => {
  res.send("Dashboard page");
});

chokidar.watch("./").on("all", (event, path) => {
  io.emit("file:refresh", path);
});

// File structure route (not sent to frontend yet)
app.get("/files", async (req, res) => {
  try {
    const fileTree = await generateFileTree(defaultDirectory);
    return res.json({ tree: fileTree });
  } catch (error) {
    console.error("Error generating file tree:", error);
    return res.status(500).json({ error: "Failed to generate file tree" });
  }
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  const ptyProcess = pty.spawn(
    process.platform === "win32" ? "cmd.exe" : "bash",
    [],
  
