const params = new URLSearchParams(location.search);
export const ROOM = params.get("room") || "global";

export const socket = io({ query: { room: ROOM } });

export let myUser = null;
export const users = new Map();

socket.on("init", ({ user, users: online }) => {
  myUser = user;
  online.forEach(u => users.set(u.id, u));
  console.log("Connected:", user.id);
});

socket.on("user-join", user => {
  users.set(user.id, user);
});

socket.on("user-leave", id => {
  users.delete(id);
});






