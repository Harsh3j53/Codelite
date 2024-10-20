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
    {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: defaultDirectory,
      env: process.env,
    }
  );

  ptyProcess.onData((data) => {
    socket.emit("terminal:data", data);
  });

  socket.on("terminal:input", (data) => {
    ptyProcess.write(data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    ptyProcess.kill();
  });
});

async function generateFileTree(directory) {
  const tree = {};
  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }
  await buildTree(directory, tree);
  return tree;
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🐳 Server running on port ${PORT}`);
});
