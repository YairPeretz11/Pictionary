import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
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

io.on("connection", (socket) => {
console.log("User connected", socket.id);


  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Define a simple route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

// Another route with a parameter
app.get("/greet/:name", (req: Request, res: Response) => {
  const name = req.params.name;
  res.json({ message: `Greetings, ${name}!` });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
