"use client";
import { useState } from "react";
import { socket } from "@/lib/socket";
import { Users, PlusCircle, LogIn } from "lucide-react";

export default function Lobby({ setRoomId, roomId }: any) {
  const [name, setName] = useState("");
  const [inputRoom, setInputRoom] = useState("");

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
        {/* ช่องใส่ชื่อ */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            เรียกคุณว่าอะไร?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
            placeholder="เช่น จอร์จ, อิฐ, เฟื่อง..."
          />
        </div>

        {!roomId ? (
          <div className="grid grid-cols-1 gap-4">
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
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg border border-red-900/30">
              <p className="text-zinc-400 text-sm">รหัสห้องของคุณ</p>
              <h2 className="text-4xl font-mono font-black text-yellow-500">
                {roomId}
              </h2>
            </div>
            <button
              onClick={() => socket.emit("start_game", roomId)}
              className="w-full bg-green-600 hover:bg-green-500 p-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20"
            >
              เริ่มเกมเลย! (เฉพาะ Host)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
