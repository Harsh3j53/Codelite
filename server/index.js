const http = require("http");
const express = require("express");
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

app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors());

const userDirectory = path.join(__dirname, "user");

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

// File watching
const watcher = chokidar.watch(userDirectory, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

watcher.on("all", async (event, path) => {
  const fileTree = await generateFileTree(userDirectory);
  io.emit("file:update", { tree: fileTree });
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  const ptyProcess = pty.spawn(
    process.platform === "win32" ? "cmd.exe" : "bash",
    [],
    {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: userDirectory,
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

app.get("/files", async (req, res) => {
  const fileTree = await generateFileTree(userDirectory);
  return res.json({ tree: fileTree });
});

app.get("/files/content", async (req, res) => {
  const filePath = req.query.path;
  const content = await fs.readFile(
    path.join(userDirectory, filePath),
    "utf-8"
  );
  return res.json({ content });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🐳 Server running on port ${PORT}`);
});
