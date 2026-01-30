import { socket, users } from "./websocket.js";

const cursors = new Map();

function updateCursor(userId, x, y) {
  let el = cursors.get(userId);
  if (!el) {
    el = document.createElement("div");
    el.className = "cursor";
    el.style.background = users.get(userId)?.color || "#000";
    document.body.appendChild(el);
    cursors.set(userId, el);
  }
  el.style.transform = `translate(${x}px, ${y}px)`;
}

document.addEventListener("mousemove", e => {
  socket.emit("cursor", { x: e.clientX, y: e.clientY });
});

socket.on("cursor", ({ userId, x, y }) => {
  updateCursor(userId, x, y);
});
