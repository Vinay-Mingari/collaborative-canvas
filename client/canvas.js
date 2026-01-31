import { socket, ROOM } from "./websocket.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", e => {
  drawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  const x = e.clientX;
  const y = e.clientY;

  drawLine(lastX, lastY, x, y);

  socket.emit("draw", {
    room: ROOM,
    x1: lastX,
    y1: lastY,
    x2: x,
    y2: y
  });

  lastX = x;
  lastY = y;
}

function drawLine(x1, y1, x2, y2) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

socket.on("draw", ({ x1, y1, x2, y2 }) => {
  drawLine(x1, y1, x2, y2);
});
