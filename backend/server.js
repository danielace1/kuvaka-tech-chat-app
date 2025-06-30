import express from "express";
import "dotenv/config";
import cors from "cors";
import { createServer } from "http";
import { connectDB } from "./lib/db.js";
import { setupWebSocketServer } from "./lib/wsServer.js";

const app = express();
const PORT = process.env.PORT || 3000;

// configure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// parse JSON requests with a limit of 5mb
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({
    message:
      "Hello, This Real-Time Chat Application using MERN Stack for Kuvaka Tech!",
  });
});

// creating http server for WebSocket
const server = createServer(app);
setupWebSocketServer(server);

// Start the server
server.listen(PORT, () => {
  connectDB(); // Connect to MongoDB
  console.log(`Server is running on http://localhost:${PORT}`);
});
