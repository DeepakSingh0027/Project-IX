import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connect } from "http2";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//create Express app
const app = express();
const server = http.createServer(app);

//socket.io setup
export const io = new Server(server, { cors: { origin: "*" } });

//store online users
export const userSocketMap = {}; // userId: socketId

//socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected with ID:", userId);
  if (userId) userSocketMap[userId] = socket.id;
  //emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  //handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected with ID:", userId);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to database
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
