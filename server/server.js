import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import { getRoom, createUser } from "./state-manager.js";
import { joinRoom } from "./rooms.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../client")));

io.on("connection", (socket) => {
  const roomId = socket.handshake.query.room || "global";
  const room = getRoom(roomId);

  const user = createUser(socket.id);
  room.users.set(socket.id, user);

  joinRoom(socket, roomId);

  socket.emit("init", { user, users: [...room.users.values()] });
  socket.to(roomId).emit("user-join", user);

  console.log("User connected:", socket.id);

  socket.on("draw", stroke => {
    const op = { ...stroke, seq: room.seq++ };
    room.operations.push(op);
    socket.to(roomId).emit("draw", op);
  });

  socket.on("cursor", data => {
    socket.to(roomId).emit("cursor", { userId: socket.id, ...data });
  });

  socket.on("undo", () => {
    room.operations.pop();
    io.to(roomId).emit("sync", room.operations);
  });

  socket.on("disconnect", () => {
    room.users.delete(socket.id);
    socket.to(roomId).emit("user-leave", socket.id);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





