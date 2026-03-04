"use client";
import { useState } from "react";
import { socket } from "@/lib/socket";
import { Users, Crown, User, PlusCircle, LogIn } from "lucide-react";

export default function Lobby({ setRoomId, roomId, players, hostId }: any) {
  const [name, setName] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const isHost = socket.id === hostId; // ✅ เช็กว่าเป็น Host หรือไม่

  const handleCreate = () => {
    if (!name) return alert("ใส่ชื่อก่อนสิเพื่อน!");
    socket.emit("create_room", name);
  };

  const handleJoin = () => {
    if (!name || !inputRoom) return alert("ใส่ชื่อและรหัสห้องด้วย!");
    socket.emit("join_room", { roomId: inputRoom, playerName: name });
    setRoomId(inputRoom.toUpperCase());
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
      <div className="space-y-6">

        {!roomId && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                เรียกคุณว่าอะไร?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="เช่น จอร์จ, อิสระ, เฟื่อง..."
              />
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold transition-transform active:scale-95"
            >
              <PlusCircle size={20} /> สร้างห้องใหม่
            </button>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">
                  หรือจอยเพื่อน
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
                className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg p-3 uppercase font-mono tracking-widest"
                placeholder="รหัส 5 หลัก"
              />
              <button
                onClick={handleJoin}
                className="bg-zinc-700 hover:bg-zinc-600 p-3 rounded-lg px-6 font-bold"
              >
                <LogIn size={20} />
              </button>
            </div>
          </div>
        )}

        {roomId && (
          <div className="space-y-6">
            <div className="p-4 bg-zinc-800 rounded-lg border border-red-900/30 text-center">
              <p className="text-zinc-500 text-xs uppercase font-bold mb-1">
                Room ID
              </p>
              <h2 className="text-4xl font-mono font-black text-yellow-500 tracking-tighter">
                {roomId}
              </h2>
            </div>

            {/* 👥 Player List Section */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                <Users size={16} /> ผู้เล่นในห้อง ({players.length})
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {players.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      {p.id === hostId ? (
                        <Crown size={16} className="text-yellow-500" />
                      ) : (
                        <User size={16} className="text-zinc-500" />
                      )}
                      <span
                        className={
                          p.id === socket.id
                            ? "text-red-400 font-bold"
                            : "text-white"
                        }
                      >
                        {p.name} {p.id === socket.id && "(คุณ)"}
                      </span>
                    </div>
                    {p.id === hostId && (
                      <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20">
                        HOST
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 🚀 Start Game Button (Conditional Rendering) */}
            {isHost ? (
              <button
                onClick={() => socket.emit("start_game", roomId)}
                className="w-full bg-green-600 hover:bg-green-500 p-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/40 transition-all active:scale-95"
              >
                เริ่มเกมเลย!
              </button>
            ) : (
              <div className="text-center p-4 bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700">
                <p className="text-zinc-500 text-sm animate-pulse">
                  รอหัวหน้าห้องเริ่มเกม...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
