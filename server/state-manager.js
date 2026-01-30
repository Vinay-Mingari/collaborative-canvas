export const rooms = new Map();

export function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      users: new Map(),
      operations: [],
      seq: 0
    });
  }
  return rooms.get(roomId);
}

export function createUser(socketId) {
  const colors = ["#ff3b3b", "#3b82ff", "#22c55e", "#f59e0b", "#a855f7"];
  return {
    id: socketId,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}




