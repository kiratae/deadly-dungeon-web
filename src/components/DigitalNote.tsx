"use client";

const DIRECTIONS = [
  { key: "N", gridClass: "col-start-2 row-start-1" },
  { key: "S", gridClass: "col-start-2 row-start-3" },
  { key: "W", gridClass: "col-start-1 row-start-2" },
  { key: "E", gridClass: "col-start-3 row-start-2" },
];

export default function DigitalNote({ notes, setNotes }: any) {
  const updateNote = (x: number, y: number, data: any) => {
    const key = `${x}-${y}`;
    setNotes((prev: any) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {
          id: "",
          doors: { N: false, E: false, S: false, W: false },
        }),
        ...data,
      },
    }));
  };

  const toggleDoor = (x: number, y: number, dir: string) => {
    const key = `${x}-${y}`;
    const currentRoom = notes[key] || {
      doors: { N: false, E: false, S: false, W: false },
    };
    updateNote(x, y, {
      doors: { ...currentRoom.doors, [dir]: !currentRoom.doors[dir] },
    });
  };

  return (
    <div className="bg-zinc-950 p-6 rounded-[2.5rem] border-4 border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Header เล็กๆ เพิ่มความเท่ */}
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
          Mapping Terminal v2.0
        </span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Grid 6x6 ที่ขยายใหญ่ขึ้น */}
      <div className="grid grid-cols-6 gap-2 bg-zinc-900/30 p-2 rounded-2xl border border-zinc-800/50">
        {Array.from({ length: 36 }).map((_, i) => {
          const x = i % 6;
          const y = Math.floor(i / 6);
          const room = notes[`${x}-${y}`] || { id: "", doors: {} };

          return (
            <div
              key={i}
              className={`group aspect-square min-w-[60px] bg-zinc-950 rounded-xl border-2 transition-all duration-300
                ${room.id ? "border-zinc-700 shadow-lg" : "border-zinc-900"}`}
            >
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 relative">
                {/* 🧭 ปุ่มกดทิศทาง (ปุ่มใหญ่ขึ้นและกดง่ายขึ้น) */}
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => toggleDoor(x, y, d.key)}
                    className={`${d.gridClass} w-full h-full flex items-center justify-center border-zinc-900/50 hover:bg-zinc-800/50 transition-colors
                      ${room.doors[d.key] ? "text-red-500 bg-red-500/5" : "text-zinc-800"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300
                      ${
                        room.doors[d.key]
                          ? "bg-red-500 shadow-[0_0_10px_#ef4444] scale-125"
                          : "bg-zinc-800 group-hover:bg-zinc-700"
                      }`}
                    />
                  </button>
                ))}

                {/* 🔢 ช่องใส่เลขห้อง (ตัวใหญ่ขึ้นมาก) */}
                <input
                  type="text"
                  value={room.id}
                  onChange={(e) => updateNote(x, y, { id: e.target.value })}
                  placeholder="?"
                  className="col-start-2 row-start-2 w-full h-full bg-transparent text-center text-[16px] font-black text-white focus:outline-none placeholder:text-zinc-900 transition-all"
                />

                {/* Coordinate Label */}
                <span className="absolute top-1 left-1 text-[6px] text-zinc-800 font-mono pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  {x}
                  {y}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
