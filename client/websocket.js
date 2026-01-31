const params = new URLSearchParams(location.search);
export const ROOM = params.get("room") || "global";

// 🔥 Railway backend socket URL
const SOCKET_URL = "https://collaborative-canvas-production-2d2d.up.railway.app";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  query: { room: ROOM }
});

export let myUser = null;
export const users = new Map();

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("init", ({ user, users: online }) => {
  myUser = user;
  online.forEach(u => users.set(u.id, u));
});

socket.on("user-join", user => {
  users.set(user.id, user);
});

socket.on("user-leave", id => {
  users.delete(id);
});



