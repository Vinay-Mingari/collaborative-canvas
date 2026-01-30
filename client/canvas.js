import { socket, myUser } from "./websocket.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = 0;
let lastY = 0;

function drawLine(x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
  if (!drawing || !myUser) return;

  const x = e.clientX;
  const y = e.clientY;

  drawLine(lastX, lastY, x, y, myUser.color);

  socket.emit("draw", {
    x1: lastX,
    y1: lastY,
    x2: x,
    y2: y,
    color: myUser.color
  });

  lastX = x;
  lastY = y;
});

socket.on("draw", (data) => {
  drawLine(data.x1, data.y1, data.x2, data.y2, data.color);
});

socket.on("sync", (ops) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ops.forEach(op => {
    drawLine(op.x1, op.y1, op.x2, op.y2, op.color);
  });
});

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") {
    socket.emit("undo");
  }
});
