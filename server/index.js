const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
const pty = require("node-pty");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Dashboard route
app.get("/dashboard", (req, res) => {
  res.send("Dashboard page");
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
      cwd: process.env.HOME,
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

// Catch-all handler for any request that doesn't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🐳 Server running on port ${PORT}`);
});
