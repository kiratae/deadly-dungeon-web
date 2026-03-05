"use client";
import {
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  ArrowRight,
} from "lucide-react";

const DoorIndicator = ({
  active,
  label,
  type,
}: {
  active: boolean;
  label: string;
  type: string;
}) => (
  <div
    className={`w-4 h-4 flex items-center justify-center text-[8px] font-black rounded-sm border transition-all
    ${
      active
        ? type == "SPAWN"
          ? "bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_8px_rgba(43,127,255,0.3)]"
          : "bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
        : "bg-zinc-900 border-zinc-800 text-zinc-800 opacity-20"
    }`}
  >
    {label}
  </div>
);

export default function LogItem({ log }: any) {
  return (
    <div
      className={`relative pl-6 border-l-2 ${log.type === "SPAWN" ? "border-blue-500" : "border-zinc-800"} transition-all`}
    >
      {/* Icon แสดงประเภทเหตุการณ์ */}
      <div
        className={`absolute -left-2.25 top-1 w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center 
                  ${log.type === "SPAWN" ? "bg-blue-500" : "bg-zinc-800"}`}
      >
        {log.type === "SPAWN" ? (
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {log.type === "SPAWN" ? (
          // --- UI ตอนเกิด ---
          <>
            <div className="flex flex-col gap-3 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 group">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1 w-[70%]">
                  <span className="text-[10px] font-black text-zinc-500 uppercase italic">
                    Initial Spawn
                  </span>

                  <div className="flex items-center justify-between px-2 py-1.5 bg-zinc-950/50 rounded-lg border border-zinc-800">
                    <div className="text-center">
                      <p className="text-[8px] text-zinc-600 font-bold uppercase">
                        Start
                      </p>
                      <p className="text-sm font-black text-zinc-400">
                        {log.to}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 grid-rows-3 gap-0.5 bg-black/40 p-1.5 rounded-lg border border-zinc-800">
                  <div />
                  <DoorIndicator
                    active={log.doors.N}
                    label="N"
                    type={log.type}
                  />
                  <div />
                  <DoorIndicator
                    active={log.doors.W}
                    label="W"
                    type={log.type}
                  />
                  <div className="w-4 h-4 rounded-full bg-zinc-800/30" />{" "}
                  <DoorIndicator
                    active={log.doors.E}
                    label="E"
                    type={log.type}
                  />
                  <div />
                  <DoorIndicator
                    active={log.doors.S}
                    label="S"
                    type={log.type}
                  />
                  <div />
                </div>
              </div>
            </div>
          </>
        ) : (
          // --- UI ตอนเดินปกติ ---
          <>
            <div className="flex flex-col gap-3 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 group">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1 w-[70%]">
                  <span className="text-[10px] font-black text-zinc-500 uppercase italic">
                    Turn {log.turn}
                  </span>
                  <span className="text-[10px] font-bold text-white">
                    เดินมาทางประตูทิศ <span className="text-red-500">{log.via}</span>
                  </span>

                  <div className="flex items-center justify-between px-2 py-1.5 bg-zinc-950/50 rounded-lg border border-zinc-800">
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-600 font-bold uppercase">
                        From
                      </p>
                      <p className="text-sm font-black text-zinc-400">
                        {log.from}
                      </p>
                    </div>
                    <ArrowRight size={18} className="text-zinc-800" />
                    <div className="text-center">
                      <p className="text-[10px] text-red-500 font-bold uppercase">
                        To
                      </p>
                      <p className="text-sm font-black text-red-400">
                        {log.to}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 grid-rows-3 gap-0.5 bg-black/40 p-1.5 rounded-lg border border-zinc-800">
                  <div />
                  <DoorIndicator
                    active={log.doors.N}
                    label="N"
                    type={log.type}
                  />
                  <div />
                  <DoorIndicator
                    active={log.doors.W}
                    label="W"
                    type={log.type}
                  />
                  <div className="w-4 h-4 rounded-full bg-zinc-800/30" />{" "}
                  <DoorIndicator
                    active={log.doors.E}
                    label="E"
                    type={log.type}
                  />
                  <div />
                  <DoorIndicator
                    active={log.doors.S}
                    label="S"
                    type={log.type}
                  />
                  <div />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
