const params = new URLSearchParams(window.location.search);
export const ROOM = params.get("room") || "global";


const BACKEND_URL = "https://collaborative-canvas-production-2d2d.up.railway.app";

export const socket = io(BACKEND_URL, {
  query: { room: ROOM },
  transports: ["websocket"]
});

export let myUser = null;
export const users = new Map();

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("init", ({ user, users: online }) => {
  myUser = user;
  online.forEach(u => users.set(u.id, u));
  console.log("Session initialized:", user.id);
});

socket.on("user-join", user => {
  users.set(user.id, user);
  console.log("User joined:", user.id);
});

socket.on("user-leave", id => {
  users.delete(id);
  console.log("User left:", id);
});
