import { WebSocketServer, WebSocket } from "ws";
import Message from "../models/message.model.js";

const clients = new Set();

export const setupWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  // Handle new WebSocket connections
  wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("message", async (data) => {
      try {
        // Parse incoming message
        const parsed = JSON.parse(data);

        if (parsed.type === "init") {
          ws.username = parsed.username;

          //send recent chat history
          const messages = await Message.find()
            .sort({ timestamp: -1 })
            .limit(50)
            .lean();

          ws.send(
            JSON.stringify({
              type: "history",
              messages: messages.reverse(),
            })
          );
        }

        // Chat message
        if (parsed.type === "message") {
          const newMsg = await Message.create({
            username: ws.username,
            message: parsed.message,
          });

          const payload = {
            type: "message",
            username: ws.username,
            message: parsed.message,
            timestamp: newMsg.timestamp,
          };

          // Broadcast to all connected clients
          for (let client of clients) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(payload));
            }
          }
        }
      } catch (error) {
        console.error("WebSocket error:", error.message);
      }
    });

    // Handle WebSocket disconnection
    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  console.log("WebSocket server is running");
};
