"use client";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import Lobby from "@/components/Lobby";
import GameBoard from "@/components/GameBoard";

export default function Home() {
  const [stage, setStage] = useState<"LOBBY" | "GAME">("LOBBY");
  const [roomId, setRoomId] = useState("");
  const [gameState, setGameState] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [hostId, setHostId] = useState("");

  useEffect(() => {
    socket.connect();

    socket.on("room_created", ({ roomId, hostId, playerName }) => {
      socket.emit("join_room", { roomId: roomId, playerName: playerName });
    });

    socket.on("room_update", ({ players, hostId, roomId }) => {
      setPlayers(players);
      setHostId(hostId);
      setRoomId(roomId);
    });

    socket.on("game_started", (data) => {
      console.log("เกมเริ่มแล้ว! ข้อมูลเริ่มต้น:", data);
      setGameState(data);
      setStage("GAME");
    });

    socket.on("turn_result", (data) => {
      console.log("ผลลัพธ์เทิร์น:", data);
      setGameState((prev: any) => ({ ...prev, ...data }));
    });

    return () => {
      socket.off("room_created");
      socket.off("room_update");
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
        <Lobby
          setRoomId={setRoomId}
          roomId={roomId}
          players={players}
          hostId={hostId}
        />
      ) : (
        <GameBoard gameState={gameState} roomId={roomId} />
      )}
    </main>
  );
}
