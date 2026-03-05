"use client";
import React, { useState } from "react";
import { Trophy, XCircle, Send } from "lucide-react";

export default function SubmissionModal({ isOpen, onClose, onSubmit }: any) {
  const [answers, setAnswers] = useState<string[]>(Array(36).fill(""));

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border-2 border-yellow-500 w-full max-w-2xl rounded-3xl p-8 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            <h2 className="text-2xl font-black text-white">THE FINAL ANSWER</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <XCircle />
          </button>
        </div>

        <p className="text-zinc-400 text-sm mb-6 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 text-center">
          &quot;ระบุหมายเลขห้องทั้ง 36 ตำแหน่งให้ถูกต้อง
          หากผิดพลาดคุณจะพบกับจุดจบ&quot;
        </p>

        <div className="grid grid-cols-6 gap-2 mb-8">
          {answers.map((val, i) => (
            <input
              key={i}
              type="text"
              maxLength={2}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              className="aspect-square bg-zinc-800 border border-zinc-700 text-center font-bold text-yellow-500 rounded-lg focus:border-yellow-500 outline-none"
              placeholder={`${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => onSubmit(answers.map((n) => parseInt(n) || 0))}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Send size={20} /> ยืนยันคำตอบสุดท้าย
        </button>
      </div>
    </div>
  );
}
