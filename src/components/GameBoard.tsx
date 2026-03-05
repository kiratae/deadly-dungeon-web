"use client";
import { useState, useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { ArrowRight, History, Trophy } from "lucide-react";
import RoomDisplay from "./RoomDisplay";
import ProximityChat from "./ProximityChat";
import DigitalNote from "./DigitalNote";
import SubmissionModal from "./SubmissionModal";
import LogItem from "./LogItem";

export default function GameBoard({ initialData, roomId, socket }: any) {
  const [pendingPlayers, setPendingPlayers] = useState<string[]>([]);
  // โครงสร้างของข้อมูลที่จด: { "x-y": { id: "12", doors: { N: true, E: false, ... } } }
  const [notes, setNotes] = useState<{ [key: string]: any }>({});

  const [showTurnPopup, setShowTurnPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [readyInfo, setReadyInfo] = useState({ readyCount: 0, totalCount: 0 });
  const [isLocalReady, setIsLocalReady] = useState(false);

  const currentRoomRef = useRef(initialData.roomNumber);
  const turnNumberRef = useRef(initialData.turnNumber);
  const lastMoveDirRef = useRef<string | null>(null);

  const [turnLog, setTurnLog] = useState<any[]>([
    {
      type: "SPAWN",
      turn: 0,
      to: initialData.roomNumber,
      doors: initialData.doors,
      note: "ตื่นขึ้นในดันเจี้ยน",
    },
  ]);
  const [currentStandingRoom, setCurrentStandingRoom] = useState<number>(
    initialData.roomNumber,
  );
  const [gameState, setGameState] = useState(initialData);

  useEffect(() => {
    socket.on("move_result", (data) => {
      console.log("ผลลัพธ์การเดิน:", data);

      setGameState((prev: any) => ({
        ...prev,
        roomNumber: data.nextRoom,
        doors: data.doors,
        isAnswerRoom: data.isAnswerRoom,
        hasMoved: true, // ล็อกการเดิน
      }));

      setTurnLog((prev) => {
        const turnNum = data.turnNumber || turnNumberRef.current;
        const otherLogs = prev.filter(
          (log) => !(log.type === "MOVE" && log.turn === turnNum),
        );

        return [
          {
            type: "MOVE",
            turn: turnNum,
            from: currentRoomRef.current,
            to: data.nextRoom,
            doors: data.doors,
            via: lastMoveDirRef.current,
            isAnswerRoom: data.isAnswerRoom,
          },
          ...otherLogs,
        ];
      });

      setIsPreview(true);
    });

    socket.on("turn_result", (data) => {
      console.log("turn_result:", data);
      setGameState((prev: any) => ({ ...prev, ...data }));
      setIsPreview(false);
      setIsLocalReady(false);

      currentRoomRef.current = data.roomNumber;
    });

    socket.on("waiting_update", ({ pendingPlayers }) => {
      setPendingPlayers(pendingPlayers);
    });

    socket.on("waiting_ready", ({ readyCount, totalCount }) => {
      setReadyInfo({ readyCount, totalCount });
    });

    socket.on("start_next_turn", ({ turnNumber, pendingPlayers }) => {
      turnNumberRef.current = turnNumber;
      // รีเซ็ตสถานะทั้งหมดเพื่อเริ่มเทิร์นใหม่
      setGameState((prev: any) => ({
        ...prev,
        turnNumber: turnNumber,
        turnProcessed: false, // ปิดโหมดจบเทิร์น
        hasMoved: false, // เปิดให้เดินได้ใหม่
        pendingPlayers: pendingPlayers,
      }));

      // รีเซ็ต UI ท้องถิ่น
      setIsLocalReady(false);
      setReadyInfo({ readyCount: 0, totalCount: 0 });

      // แสดง Popup Turn Start (อันเดิมที่เราทำไว้)
      setShowTurnPopup(true);
      const timer = setTimeout(() => setShowTurnPopup(false), 2000);
      return () => clearTimeout(timer);
    });

    return () => {
      socket.off("move_result");
      socket.off("turn_result");
      socket.off("waiting_update");
      socket.off("waiting_ready");
      socket.off("start_next_turn");
    };
  }, [socket, gameState.turnNumber]);

  useEffect(() => {
    if (gameState.pendingPlayers) {
      setPendingPlayers(
        gameState.pendingPlayers.filter((p: string) => p !== socket.id),
      );
    }
  }, [gameState.pendingPlayers]);

  const handleReadyClick = () => {
    setIsLocalReady(true);
    socket.emit("ready_for_next_turn", { roomId });
  };

  const handleFinalSubmit = (submittedMap: number[]) => {
    socket.emit("submit_final_map", { roomId, submittedMap });
    setIsModalOpen(false);
  };

  const handleMove = (dir: string) => {
    if (gameState.hasMoved) return;
    lastMoveDirRef.current = dir;
    socket.emit("player_move", { roomId, direction: dir });
  };

  return (
    <div className="mmax-w-[1400px] mx-auto grid grid-cols-12 gap-6 p-6">
      {/* 1. Left Sidebar: Digital Mapping */}
      <div className="col-span-12 lg:col-span-5">
        <DigitalNote
          notes={notes}
          setNotes={setNotes}
        />
      </div>

      {/* 2. Center: Game Core (Room Display & Controls) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {isPreview && (
          <div className="bg-blue-600/20 border border-blue-500 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black animate-pulse uppercase tracking-widest">
            Coordinate Locked - Waiting for others
          </div>
        )}

        <RoomDisplay
          gameState={gameState}
          onMove={handleMove}
          disabled={gameState.hasMoved}
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* ✅ ปุ่ม Ready For Next Turn (จะปรากฏเมื่อจบเทิร์น) */}
        {gameState.turnProcessed && (
          <div className="w-full max-w-125 mx-auto bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-black text-white tracking-tight italic">
                {isLocalReady ? "STANDBY FOR ENTRY" : "TURN CONCLUDED"}
              </h3>

              {/* Progress Bar แสดงจำนวนคน Ready */}
              <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  style={{
                    width: `${(readyInfo.readyCount / readyInfo.totalCount) * 100}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>Waiting for squad</span>
                <span className="text-green-500">
                  {readyInfo.readyCount} / {readyInfo.totalCount} READY
                </span>
              </div>

              {!isLocalReady ? (
                <button
                  onClick={handleReadyClick}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-lg transition-transform active:scale-95 shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                >
                  READY FOR NEXT TURN
                </button>
              ) : (
                <div className="w-full py-4 bg-zinc-800/50 rounded-xl border border-dashed border-zinc-700 text-zinc-500 font-bold flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  WAITING FOR OTHERS...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Right Sidebar: Discovery Log & Proximity Chat */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        {/* Discovery Log Component */}
        <div className="flex-1 max-h-[400px] flex flex-col overflow-y-auto p-3 space-y-4">
          {turnLog.map((log) => (
            <LogItem key={`${log.type}-${log.turn}`} log={log} />
          ))}
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

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFinalSubmit}
      />
    </div>
  );
}
