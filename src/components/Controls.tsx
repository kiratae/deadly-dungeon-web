"use client";
import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { socket } from "@/lib/socket";

export default function Controls({ gameState, roomId }: any) {
  const { doors, yourPos } = gameState;

  const handleMove = (dir: string) => {
    let nextPos = { ...yourPos };
    if (dir === "N") nextPos.y--;
    if (dir === "S") nextPos.y++;
    if (dir === "E") nextPos.x++;
    if (dir === "W") nextPos.x--;

    socket.emit("player_move", { roomId, targetPos: nextPos });
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      <div />
      <MoveButton icon={<MoveUp />} active={doors.N} onClick={() => handleMove("N")} />
      <div />
      <MoveButton icon={<MoveLeft />} active={doors.W} onClick={() => handleMove("W")} />
      <MoveButton icon={<MoveDown />} active={doors.S} onClick={() => handleMove("S")} />
      <MoveButton icon={<MoveRight />} active={doors.E} onClick={() => handleMove("E")} />
    </div>
  );
}

function MoveButton({ icon, active, onClick }: any) {
  return (
    <button
      disabled={!active}
      onClick={onClick}
      className={`p-4 rounded-lg transition-all ${
        active 
          ? "bg-red-600 hover:bg-red-500 shadow-lg" 
          : "bg-gray-800 opacity-20 cursor-not-allowed"
      }`}
    >
      {icon}
    </button>
  );
}