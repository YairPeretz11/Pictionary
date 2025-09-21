import express, { type Request, type Response } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());

let currentDrawerId: string | null = null;

io.on("connection", (socket) => {
  socket.on("message", (data: string) => {
    io.emit("message", data);
  });

  socket.on("drawing", (data: string) => {
    if (typeof data === "string" && data.length > 0) {
      socket.broadcast.emit("drawing", data);
    }
  });

  socket.on("drawing:clear", () => {
    socket.broadcast.emit("drawing:clear");
  });

  socket.on("drawing:charge", (id: string) => {
    currentDrawerId = id;
    io.emit("drawing:charge", currentDrawerId);
  });

  // Respond with who is in charge
  socket.on("drawing:whoInCharge", () => {
    if (currentDrawerId) {
      socket.emit("drawing:whoInCharge", currentDrawerId);
    }
  });

  socket.on("disconnect", () => {
    if (socket.id === currentDrawerId) {
      currentDrawerId = null;
      io.emit("drawing:charge", null);
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
