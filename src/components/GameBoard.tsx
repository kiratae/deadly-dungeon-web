"use client";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import Controls from "./Controls";
import { Timer, UserCheck, Compass, DoorOpen, Ghost } from "lucide-react";

export default function GameBoard({ gameState, roomId }: any) {
  const [pendingPlayers, setPendingPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (gameState.pendingPlayers) {
      setPendingPlayers(gameState.pendingPlayers.filter((p: string) => p !== socket.id));
    }

    return () => {
      socket.off("waiting_update");
    };
  }, [gameState.pendingPlayers]);

  useEffect(() => {
    socket.on("waiting_update", ({ pendingPlayers }) => {
      setPendingPlayers(pendingPlayers);
    });
    return () => {
      socket.off("waiting_update");
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      {/* 📊 Turn Info & Status Bar */}
      <div className="w-full flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-2 rounded-lg">
            <Timer size={18} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">
              เทิร์นปัจจุบัน
            </p>
            <p className="text-xl font-black font-mono">
              #{gameState.turnNumber || 1}
            </p>
          </div>
        </div>

        {pendingPlayers.length > 0 && (
          <div className="flex flex-col items-end">
            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">
              กำลังรอ...
            </p>
            <div className="flex -space-x-2">
              {pendingPlayers.map((name, i) => (
                <div
                  key={i}
                  title={name}
                  className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-red-400"
                >
                  {name.substring(0, 2)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🏰 ห้องปัจจุบัน (Current Room Card) */}
      <div className="w-full aspect-square md:aspect-video bg-zinc-900 border-4 border-zinc-800 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* เอฟเฟกต์หมอก/ความมืด */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-[0.3em] mb-2 z-10">
          ห้องหมายเลข
        </h3>
        <span className="text-8xl font-black text-white z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {gameState.roomNumber}
        </span>

        {/* แจ้งเตือนเสียงกึกกัก */}
        {gameState.heardNoise && (
          <div className="absolute top-6 px-4 py-1 bg-red-600/20 border border-red-500 rounded-full text-red-500 text-[10px] font-bold animate-pulse z-10">
            ⚠️ ได้ยินเสียงกึกกักรอบห้อง...
          </div>
        )}
      </div>

      {/* 🧭 ข้อมูลประตูและสถานะ */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400">
            <DoorOpen size={24} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">
              ประตูที่พบ
            </p>
            <p className="text-sm font-bold">
              {[
                gameState.doors.N && "เหนือ",
                gameState.doors.E && "ตะวันออก",
                gameState.doors.S && "ใต้",
                gameState.doors.W && "ตะวันตก",
              ]
                .filter(Boolean)
                .join(", ") || "ไม่มีทางไปต่อ"}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400">
            <Ghost size={24} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">
              สถานะ
            </p>
            <p className="text-sm font-bold text-green-500">ยังมีชีวิตอยู่</p>
          </div>
        </div>
      </div>

      {/* 📜 รายชื่อสถานะแบบละเอียด (ด้านล่าง) */}
      {pendingPlayers.length > 0 && (
        <div className="w-full p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-center">
          <p className="text-yellow-500 text-xs font-medium flex items-center justify-center gap-2">
            <UserCheck size={14} />
            ตอนนี้เหลือคุณ{" "}
            <span className="font-bold underline">
              {pendingPlayers.join(", ")}
            </span>{" "}
            ยังไม่ได้เดิน
          </p>
        </div>
      )}

      {/* 🕹️ ปุ่มควบคุมการเดิน */}
      <Controls gameState={gameState} roomId={roomId} />

      <p className="text-zinc-600 text-[10px] italic text-center">
        &quot;จดเลขห้องและประตูไว้ให้ดี... เพราะไม่มีใครบอกทางกลับให้คุณ&quot;
      </p>
    </div>
  );
}
