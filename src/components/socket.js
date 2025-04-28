import { io } from "socket.io-client";

const socket = io("ws:https://database-backend-production.up.railway.app/", { reconnection: true });

socket.on("connect", () => {
    console.log("Admin Connected to WebSocket Server");
    socket.emit("registerAdmin", "admin-123");
});

socket.on("disconnect", () => {
    console.log("Admin Disconnected from WebSocket Server");
});

export default socket;
