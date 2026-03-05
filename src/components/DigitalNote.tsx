"use client";

interface NoteData {
  id: string;
  doors: { N: boolean; E: boolean; S: boolean; W: boolean };
}

interface DigitalNoteProps {
  notes: { [key: string]: NoteData };
  onNoteChange: (x: number, y: number, data: NoteData) => void;
}

const DigitalNote = ({ notes, onNoteChange }: DigitalNoteProps) => {
  const gridCells = Array.from({ length: 36 });

  const toggleDoor = (x: number, y: number, dir: keyof NoteData["doors"]) => {
    const key = `${x}-${y}`;
    const current = notes[key] || {
      id: "",
      doors: { N: false, E: false, S: false, W: false },
    };
    onNoteChange(x, y, {
      ...current,
      doors: { ...current.doors, [dir]: !current.doors[dir] },
    });
  };

  const updateId = (x: number, y: number, val: string) => {
    const key = `${x}-${y}`;
    const current = notes[key] || {
      id: "",
      doors: { N: false, E: false, S: false, W: false },
    };
    onNoteChange(x, y, { ...current, id: val });
  };

  return (
    <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 backdrop-blur-sm">
      <h3 className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest text-center">
        Digital Mapping System
      </h3>
      <div className="grid grid-cols-6 gap-1">
        {gridCells.map((_, i) => {
          const x = i % 6;
          const y = Math.floor(i / 6);
          const key = `${x}-${y}`;
          const cell = notes[key] || {
            id: "",
            doors: { N: false, E: false, S: false, W: false },
          };

          return (
            <div
              key={i}
              className="aspect-square bg-zinc-950 border border-zinc-800 flex flex-col p-1 hover:border-zinc-600 transition-colors"
            >
              <input
                type="text"
                maxLength={2}
                value={cell.id}
                onChange={(e) => updateId(x, y, e.target.value)}
                className="w-full bg-transparent text-center text-[10px] font-bold text-red-500 outline-none placeholder:text-zinc-800"
                placeholder="?"
              />
              <div className="mt-auto grid grid-cols-2 gap-0.5">
                {["N", "S", "E", "W"].map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      toggleDoor(x, y, d as keyof NoteData["doors"])
                    }
                    className={`text-[7px] font-bold rounded-[1px] ${
                      cell.doors[d as keyof NoteData["doors"]]
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DigitalNote;
