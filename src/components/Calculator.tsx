import React, { useState } from 'react';
import { Calculator as CalcIcon, Send, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import * as math from 'mathjs';

interface CalculatorProps {
  onSolve: (expression: string) => void;
  isLoading: boolean;
  className?: string;
}

export default function Calculator({ onSolve, isLoading, className }: CalculatorProps) {
  const [expression, setExpression] = useState('');
  const [localResult, setLocalResult] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
    try {
      if (e.target.value.trim()) {
        const result = math.evaluate(e.target.value);
        setLocalResult(result.toString());
      } else {
        setLocalResult(null);
      }
    } catch {
      setLocalResult(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expression.trim()) {
      onSolve(expression);
    }
  };

  const quickFormulas = [
    { name: "Quadratic", formula: "x = (-b ± sqrt(b^2 - 4ac)) / 2a" },
    { name: "Force", formula: "F = m * a" },
    { name: "Energy", formula: "E = m * c^2" },
    { name: "Pythagoras", formula: "a^2 + b^2 = c^2" },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Input Formula</label>
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={expression}
            onChange={handleInputChange}
            placeholder="T = 2π√(L/g) + Δk"
            className="w-full p-3 pr-12 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !expression.trim()}
            className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={16} /></motion.div> : <Send size={16} />}
          </button>
        </form>

        <AnimatePresence>
          {localResult && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between"
            >
              <span className="text-[10px] font-bold text-indigo-700 uppercase">Quick Solve</span>
              <span className="text-sm font-mono font-bold text-indigo-900">{localResult}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {quickFormulas.map((f) => (
          <button
            key={f.name}
            onClick={() => setExpression(f.formula)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-left hover:border-indigo-300 hover:bg-slate-50 transition-all group"
          >
            <span className="text-[9px] font-bold uppercase text-slate-400 group-hover:text-indigo-600 block mb-0.5">{f.name}</span>
            <p className="text-[11px] font-mono text-slate-600 truncate">{f.formula}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
