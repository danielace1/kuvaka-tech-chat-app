# Kuvaka Tech - 💬 Real-Time Chat App

A real-time chat application built using the **MERN stack** (MongoDB, Express, React, Node.js) and **WebSockets**. Users can join by entering a username and chat instantly with others in real-time. Messages are saved to a MongoDB database and chat history is automatically loaded.

## Live Links

- **Frontend** (Vercel): https://kuvaka-tech-chat-app.vercel.app

- **Backend** (Render): https://kuvaka-tech-chat-app-backend.onrender.com

## Technologies Used :

- **_Frontend_**: React.js, TailwindCSS
- **_Backend_**: Node.js, Express.js, WebSocket
- **_Database_**: MongoDB with Mongoose

## Architecture Overview :

- **Frontend**: React SPA with WebSocket client
- **Backend**: Express.js server + native WebSocket server via `ws` package
- **Database**: MongoDB stores messages with timestamps
- **WebSocket**: Manages real-time communication and message broadcasting

## Features :

- Real-time chat using WebSocket
- Message persistence with MongoDB
- Automatically loads previous 50 messages
- Simple username-based entry (no authentication)
- Graceful handling of connection/disconnection
- Leave chat functionality with confirmation

## Concurrency Handling:

- A `Set` tracks all active WebSocket clients.
- Each socket is associated with a username using a `Map`.
- On new connection:
  - Server receives `{ type: "init", username }`
  - Sends back recent message history
- When a user sends a message:
  - Server saves to MongoDB
  - Broadcasts the message to all connected clients using `WebSocket.OPEN` status
- On disconnect:
  - The user is removed from active socket tracking

## WebSocket Communication Flow :

- Client connects to WebSocket and sends `{ type: "init", username }`.
- Server stores the socket-user mapping, sends recent chat history.
- User sends a message `{ type: "message", message }`.
- Server stores the message in MongoDB and broadcasts to all connected clients.
- On disconnect, server cleans up socket-user tracking.

## Assumptions & Design Choices

- Messages are stored with timestamps and retrieved in order.
- WebSocket is used natively instead of Socket.io to keep the stack lightweight.
- A simple username-based login is used for quick entry; no authentication.
- day.js is used for lightweight date formatting.
- Message sending is disabled on empty input to avoid blank messages.
- Disconnection is handled gracefully with a confirmation prompt.

## Using the App :

- Open the frontend URL.
- Enter a username to join the chat.
- Start chatting with others in real time!

## Local Setup & Running Instructions

### Prerequisites

- Node.js & npm
- MongoDB

1. Clone the Repository

```bash
git clone https://github.com/danielace1/kuvaka-tech-chat-app.git

```

2. Backend Setup

```bash
cd backend
npm install
```

- Configure Environment Variables:
  _Create a .env file in the backend_

```bash
MONGO_DB_URL =
PORT =
CLIENT_URL =
```

- Run the backend.

```bash
cd backend
npm run dev
```

3. Frontend Setup

```bash
cd frontend
npm install
```

- Configure Environment Variables:
  _Create a .env file in the frontend_

```bash
VITE_WEB_SOCKET_URL_PROD =
```

- Run the frontend.

```bash
cd frontend
npm run dev
```

- Now visit `http://localhost:5173` in your browser.
