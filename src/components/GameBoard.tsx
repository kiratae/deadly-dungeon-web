"use client";
import { useState } from "react";
import Controls from "./Controls";

export default function GameBoard({ gameState, roomId }: any) {
  // เก็บโน้ตเลขห้องที่ผู้เล่นจดเอง (ไม่เกี่ยวกับ Server)
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const handleNoteChange = (x: number, y: number, value: string) => {
    setNotes(prev => ({ ...prev, [`${x}-${y}`]: value }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-5xl">
      {/* ฝั่งซ้าย: ตารางดันเจี้ยน */}
      <div className="flex-1">
        <div className="grid grid-cols-6 gap-2 bg-zinc-800 p-3 rounded-xl border-4 border-zinc-900 shadow-2xl">
          {Array.from({ length: 36 }).map((_, i) => {
            const x = i % 6;
            const y = Math.floor(i / 6);
            const isCurrent = x === gameState.yourPos.x && y === gameState.yourPos.y;
            const key = `${x}-${y}`;

            return (
              <div
                key={i}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-md border transition-all duration-500
                  ${isCurrent 
                    ? 'bg-red-600 border-red-400 scale-105 z-10 shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                    : 'bg-zinc-900 border-zinc-800'}
                `}
              >
                {isCurrent ? (
                  <>
                    <span className="text-2xl font-black">{gameState.roomNumber}</span>
                    <div className="absolute -bottom-1 w-2 h-2 bg-white rounded-full animate-ping" />
                  </>
                ) : (
                  <input
                    type="text"
                    maxLength={2}
                    value={notes[key] || ""}
                    onChange={(e) => handleNoteChange(x, y, e.target.value)}
                    className="w-full h-full bg-transparent text-center text-sm text-zinc-500 outline-none focus:text-zinc-200"
                    placeholder="..."
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ฝั่งขวา: สถานะและปุ่มเดิน */}
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-4">สถานะปัจจุบัน</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>ตำแหน่ง</span>
              <span className="font-mono text-red-500">X:{gameState.yourPos.x} Y:{gameState.yourPos.y}</span>
            </div>
            {gameState.heardNoise && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg animate-pulse text-red-400 text-sm text-center font-bold">
                ⚠️ ได้ยินเสียงกึกกักรอบๆ ห้อง!
              </div>
            )}
          </div>
        </div>

        <Controls gameState={gameState} roomId={roomId} />
      </div>
    </div>
  );
}