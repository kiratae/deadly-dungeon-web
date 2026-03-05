"use client";
import { useState, useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { MessageSquare, Send, Users } from "lucide-react";

export default function ProximityChat({ roomId, metPlayers }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // เลื่อนลงล่างสุดอัตโนมัติเมื่อมีข้อความใหม่
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("receive_proximity_msg", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("receive_proximity_msg");
    };
  }, []);

  const sendMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || metPlayers.length === 0) return;
    socket.emit("send_proximity_msg", { roomId, message: input });
    setInput("");
  };

  return (
    <div className="w-full md:w-80 h-125 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
      {/* Header แชท */}
      <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-red-500" />
          <span className="font-bold text-sm">PROXIMITY CHAT</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-zinc-700 px-2 py-1 rounded">
          <Users size={12} /> {metPlayers.length} คนอยู่ใกล้ๆ
        </div>
      </div>

      {/* ช่องแสดงข้อความ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {metPlayers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center space-y-2 italic">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center opacity-50">
              🤫
            </div>
            <p>
              ไม่มีใครอยู่ในห้องนี้... <br />
              คุณทำได้เพียงคุยกับตัวเอง
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-bottom-1">
              <p className="text-red-500 font-bold underline mb-1">
                {msg.senderName}:
              </p>
              <p className="text-zinc-200 leading-relaxed bg-zinc-800 p-2 rounded-lg border-l-2 border-red-600">
                {msg.message}
              </p>
              <p className="text-[8px] text-zinc-600 mt-1">{msg.time}</p>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ช่องกรอกข้อความ */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-zinc-800/30 border-t border-zinc-800"
      >
        <div className="flex gap-2">
          <input
            disabled={metPlayers.length === 0}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-red-500 disabled:opacity-30"
            placeholder={
              metPlayers.length > 0
                ? "พิมพ์หาเพื่อน..."
                : "ต้องเจอเพื่อนก่อนถึงจะคุยได้"
            }
          />
          <button
            type="submit"
            disabled={metPlayers.length === 0}
            className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-30"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
