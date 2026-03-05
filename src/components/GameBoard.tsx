"use client";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import Controls from "./Controls";
import {
  Timer,
  UserCheck,
  History,
  DoorOpen,
  Ghost,
  ShieldAlert,
} from "lucide-react";
import RoomDisplay from "./RoomDisplay";
import ProximityChat from "./ProximityChat";
import DigitalNote from "./DigitalNote";

export default function GameBoard({ gameState, roomId }: any) {
  const [pendingPlayers, setPendingPlayers] = useState<string[]>([]);
  // โครงสร้างของข้อมูลที่จด: { "x-y": { id: "12", doors: { N: true, E: false, ... } } }
  const [notes, setNotes] = useState<{ [key: string]: any }>({});
  const [turnLog, setTurnLog] = useState<any[]>([]); // สำหรับเก็บประวัติรายเทิร์น
  const [showTurnPopup, setShowTurnPopup] = useState(false); // สำหรับ Popup แจ้งเตือน

  useEffect(() => {
    if (!gameState.turnNumber || !gameState.roomNumber) return;

    setTurnLog((prev) => {
      // 🛡️ ตรวจสอบก่อนว่าเทิร์นนี้ถูกบันทึกไปแล้วหรือยัง
      const isAlreadyLogged = prev.some(
        (log) => log.turn === gameState.turnNumber,
      );

      if (isAlreadyLogged) {
        return prev; // ถ้ามีแล้ว ไม่ต้องทำอะไร ส่ง State เดิมกลับไป
      }

      // ถ้ายังไม่มี ให้สร้าง Entry ใหม่
      const newEntry = {
        turn: gameState.turnNumber,
        room: gameState.roomNumber,
        doors: gameState.doors,
      };

      return [newEntry, ...prev];
    });

    // แสดง Popup แจ้งเทิร์นใหม่
    setShowTurnPopup(true);
    const timer = setTimeout(() => setShowTurnPopup(false), 2000);

    return () => clearTimeout(timer);
  }, [gameState.turnNumber, gameState.roomNumber, gameState.doors]); // ตรวจสอบทั้งคู่เพื่อความแม่นยำ

  useEffect(() => {
    if (gameState.pendingPlayers) {
      setPendingPlayers(
        gameState.pendingPlayers.filter((p: string) => p !== socket.id),
      );
    }
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
    <div className="mmax-w-[1400px] mx-auto grid grid-cols-12 gap-6 p-6">
      {/* 1. Left Sidebar: Digital Mapping */}
      <div className="col-span-12 lg:col-span-3">
        <DigitalNote
          notes={notes}
          onNoteChange={(x, y, data) =>
            setNotes((prev) => ({ ...prev, [`${x}-${y}`]: data }))
          }
        />
      </div>

      {/* 2. Center: Game Core (Room Display & Controls) */}
      <div className="col-span-12 lg:col-span-6 space-y-6">
        <RoomDisplay
          gameState={gameState}
          onMove={(dir) => {
            // Logic การส่ง socket.emit เดิมของคุณ
            socket.emit("player_move", {
              roomId,
              targetPos: calculateNextPos(gameState.yourPos, dir),
            });
          }}
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Room Number & Heard Noise Warning */}
        <div className="relative aspect-video bg-zinc-950 border-x-4 border-red-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
          <h2 className="text-9xl font-black italic">{gameState.roomNumber}</h2>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <Controls gameState={gameState} roomId={roomId} />
        </div>
      </div>

      {/* 3. Right Sidebar: Discovery Log & Proximity Chat */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        {/* Discovery Log Component */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 h-64 overflow-hidden flex flex-col">
          <div className="p-3 bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">
            Discovery Log
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {turnLog.map((log, i) => (
              <div
                key={`${log.turn}-${i}`}
                className="p-2 bg-zinc-950 rounded border-l-2 border-red-600 flex justify-between"
              >
                <span className="text-zinc-500 text-[10px]">T#{log.turn}</span>
                <span className="font-bold text-sm">ห้อง {log.room}</span>
              </div>
            ))}
          </div>
        </div>

        <ProximityChat
          roomId={roomId}
          metPlayers={gameState.metPlayers || []}
        />
      </div>

      {/* 🔔 Turn Popup (แสดงเมื่อเปลี่ยนเทิร์น) */}
      {showTurnPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600 text-white px-12 py-6 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-in zoom-in duration-300 text-center">
            <h2 className="text-sm uppercase tracking-[0.5em] font-bold opacity-80">
              เริ่มต้นเทิร์นใหม่
            </h2>
            <p className="text-6xl font-black">TURN {gameState.turnNumber}</p>
          </div>
        </div>
      )}
    </div>
  );
}
