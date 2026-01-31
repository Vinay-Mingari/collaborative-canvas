import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static("client"));

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("join-room", room => {
    socket.join(room);
    console.log("Joined room:", room);
  });

  socket.on("draw", data => {
    socket.to(data.room).emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});


