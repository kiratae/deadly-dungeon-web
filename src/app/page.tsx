"use client";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import Lobby from "@/components/Lobby";
import GameBoard from "@/components/GameBoard";

export default function Home() {
  const [stage, setStage] = useState<"LOBBY" | "GAME">("LOBBY");
  const [roomId, setRoomId] = useState("");
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    socket.connect();

    socket.on("room_created", ({ roomId }) => {
      console.log("ได้รับรหัสห้องแล้ว:", roomId); // ลองใส่ log เช็กดู
      setRoomId(roomId); // ✅ เมื่อ State นี้เปลี่ยน UI ใน Lobby จะเปลี่ยนตาม
    });

    socket.on("player_joined", (players) => {
      console.log("มีเพื่อนจอยเข้ามา:", players);
    });

    socket.on("game_started", (data) => {
      setGameState(data);
      setStage("GAME");
    });

    socket.on("turn_result", (data) => {
      setGameState((prev: any) => ({ ...prev, ...data }));
    });

    return () => {
      socket.off("room_created");
      socket.off("player_joined");
      socket.off("game_started");
      socket.off("turn_result");
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-4xl font-extrabold text-red-600 mb-8 tracking-tighter">
        DEADLY DUNGEON
      </h1>

      {stage === "LOBBY" ? (
        <Lobby setRoomId={setRoomId} roomId={roomId} />
      ) : (
        <GameBoard gameState={gameState} roomId={roomId} />
      )}
    </main>
  );
}
