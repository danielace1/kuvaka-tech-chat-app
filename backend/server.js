import express from "express";
import "dotenv/config";
import cors from "cors";
import { createServer } from "http";
import { connectDB } from "./lib/db.js";
import { setupWebSocketServer } from "./lib/wsServer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const server = createServer(app);

app.get("/", (req, res) => {
  res.json({
    message:
      "Hello, This Real-Time Chat Application using MERN Stack for Kuvaka Tech!",
  });
});

app.listen(PORT, () => {
  connectDB();
  setupWebSocketServer(server);
  console.log(`Server is running on http://localhost:${PORT}`);
});
