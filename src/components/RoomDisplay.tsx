"use client";
import React from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Trophy,
} from "lucide-react";

interface RoomDisplayProps {
  gameState: any;
  onMove: (dir: string) => void;
  onOpenModal: () => void;
}

const RoomDisplay = ({ gameState, onMove, onOpenModal }: RoomDisplayProps) => {
  const { roomNumber, doors, isAnswerRoom, heardNoise } = gameState;

  return (
    <div
      className={`relative aspect-square max-w-[500px] w-full mx-auto bg-zinc-950 border-4 rounded-[3rem] flex items-center justify-center shadow-2xl overflow-hidden transition-all duration-700
      ${isAnswerRoom ? "border-yellow-600 shadow-yellow-900/20" : "border-zinc-900 shadow-black/50"}`}
    >
      {/* 💡 Ambient Light */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent to-transparent
        ${isAnswerRoom ? "via-yellow-500/5" : "via-zinc-800/10"}`}
      />

      {/* 🚪 North Door */}
      <button
        disabled={!doors.N}
        onClick={() => onMove("N")}
        className={`absolute top-0 w-full h-24 flex flex-col items-center pt-4 transition-all
          ${doors.N ? "text-red-500 hover:bg-red-500/10 hover:pt-2" : "text-zinc-800 opacity-20 cursor-not-allowed"}`}
      >
        <ChevronUp size={48} className={doors.N ? "animate-bounce" : ""} />
        <span className="text-[10px] font-black tracking-[0.2em] mt-1">
          NORTH
        </span>
      </button>

      {/* 🚪 West Door */}
      <button
        disabled={!doors.W}
        onClick={() => onMove("W")}
        className={`absolute left-0 h-full w-24 flex items-center pl-4 transition-all
          ${doors.W ? "text-red-500 hover:bg-red-500/10 hover:pl-2" : "text-zinc-800 opacity-20 cursor-not-allowed"}`}
      >
        <ChevronLeft size={48} />
        <span className="text-[10px] font-black tracking-[0.2em] -rotate-90 origin-left ml-6">
          WEST
        </span>
      </button>

      {/* 🚪 East Door */}
      <button
        disabled={!doors.E}
        onClick={() => onMove("E")}
        className={`absolute right-0 h-full w-24 flex items-center justify-end pr-4 transition-all
          ${doors.E ? "text-red-500 hover:bg-red-500/10 hover:pr-2" : "text-zinc-800 opacity-20 cursor-not-allowed"}`}
      >
        <span className="text-[10px] font-black tracking-[0.2em] rotate-90 origin-right mr-6">
          EAST
        </span>
        <ChevronRight size={48} />
      </button>

      {/* 🚪 South Door */}
      <button
        disabled={!doors.S}
        onClick={() => onMove("S")}
        className={`absolute bottom-0 w-full h-24 flex flex-col items-center justify-end pb-4 transition-all
          ${doors.S ? "text-red-500 hover:bg-red-500/10 hover:pb-2" : "text-zinc-800 opacity-20 cursor-not-allowed"}`}
      >
        <span className="text-[10px] font-black tracking-[0.2em] mb-1">
          SOUTH
        </span>
        <ChevronDown size={48} />
      </button>

      {/* 🔢 Room Content */}
      <div className="text-center z-10 select-none">
        <p
          className={`text-xs font-bold tracking-[0.4em] mb-2 uppercase 
          ${isAnswerRoom ? "text-yellow-600" : "text-zinc-600"}`}
        >
          {isAnswerRoom ? "The Answer" : "Current Room"}
        </p>
        <h2
          className={`text-[10rem] font-black tracking-tighter italic leading-none transition-all duration-700
          ${isAnswerRoom ? "text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]" : "text-white"}`}
        >
          {roomNumber}
        </h2>

        {heardNoise && (
          <div className="mt-6 flex items-center gap-2 justify-center text-red-500 animate-pulse">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Something is near
            </span>
          </div>
        )}
      </div>

      {/* 🏆 Submit Action */}
      {isAnswerRoom && (
        <button
          onClick={onOpenModal}
          className="absolute bottom-28 bg-yellow-500 text-black px-6 py-2 rounded-full font-black text-[10px] hover:bg-yellow-400 shadow-xl flex items-center gap-2 transition-transform active:scale-95 animate-in fade-in slide-in-from-bottom-4"
        >
          <Trophy size={14} /> SUBMIT MAP
        </button>
      )}
    </div>
  );
};

export default RoomDisplay;