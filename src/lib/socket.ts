"use client";
import { io, Socket } from "socket.io-client";

// สร้าง instance เพียงตัวเดียว
export const socket: Socket = io("http://localhost:3001", {
  autoConnect: false,
});