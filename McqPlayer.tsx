import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import type { McqQuestion } from "../lib/types";

export default function McqPlayer({ questions }: { questions: McqQuestion[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const score = questions.reduce((s, q, i) => s + (picked[i] === q.answer ? 1 : 0), 0);
  const answered = Object.keys(picked).length;

  function reset() {
    setPicked({});
    setChecked(false);
  }

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <div key={i} className="card p-5 sm:p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-aqua">
            Question {i + 1} / {questions.length}
          </p>
          <p className="mt-2 text-base font-semibold leading-relaxed">{q.question}</p>
          <div className="mt-4 grid gap-2.5">
            {q.options.map((opt, j) => {
              const isPicked = picked[i] === j;
              const isRight = checked && j === q.answer;
              const isWrong = checked && isPicked && j !== q.answer;
              return (
                <button
                  key={j}
                  disabled={checked}
                  onClick={() => setPicked((p) => ({ ...p, [i]: j }))}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    isRight
                      ? "border-lime bg-lime/15 text-lime"
                      : isWrong
                        ? "border-coral bg-coral/10 text-coral"
                        : isPicked
                          ? "border-aqua bg-aqua/10"
                          : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="mt-0.5 font-mono text-xs font-bold">{String.fromCharCode(65 + j)}</span>
                  <span className="flex-1">{opt}</span>
                  {isRight && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  {isWrong && <XCircle className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
          {checked && q.explanation && (
            <p className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
              <span className="font-mono text-[10px] uppercase tracking-widest">Why · </span>
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      <div className="card sticky bottom-24 flex flex-wrap items-center justify-between gap-4 p-4 lg:bottom-4">
        {checked ? (
          <p className="font-display text-lg font-bold">
            Score: <span className="text-lime">{score}</span> / {questions.length}
          </p>
        ) : (
          <p className="font-mono text-xs uppercase tracking-widest text-mute">
            {answered} / {questions.length} answered
          </p>
        )}
        <div className="flex gap-3">
          <button onClick={reset} className="btn-ghost btn-sm">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          {!checked && (
            <button onClick={() => setChecked(true)} disabled={answered === 0} className="btn-primary btn-sm">
              Check answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
